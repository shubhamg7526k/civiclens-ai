from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
import uuid

# Import your local modules
from app import models, database, ai_service
from app.database import get_db

# Initialize the database
models.Base.metadata.create_all(bind=database.engine)

# Initialize the FastAPI app
app = FastAPI()

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://civiclens-ai-iota.vercel.app", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------

@app.get("/api/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).order_by(models.Report.id.desc()).all()

@app.post("/api/reports")
async def create_report(
    file: UploadFile = File(...),
    lat: float = Form(None), 
    lng: float = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Create a unique filename to prevent Windows file-locking issues
        file_ext = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"uploads/{unique_filename}"
        
        # Save the uploaded file safely
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run the AI Analysis
        ai_data = ai_service.analyze_image(file_path)
        
        # 1. Handle complete failure
        if not ai_data:
            raise HTTPException(status_code=500, detail="AI analysis failed completely.")

        # 2. Handle specific AI service errors (like Rate Limits)
        if "error" in ai_data:
            if ai_data["error"] == "rate_limit":
                raise HTTPException(status_code=429, detail="High network traffic. Please wait 60 seconds and try again.")
            else:
                raise HTTPException(status_code=500, detail=ai_data.get("message", "Failed to process image."))

        # Create the database record with GPS coordinates
        new_report = models.Report(
            issue_type=ai_data.get("issue_type", "Unknown"),
            severity=ai_data.get("severity", "Medium"),
            description=ai_data.get("description", "No description provided."),
            suggested_action=ai_data.get("suggested_action", ""),
            image_path=file_path,
            status="Pending",
            latitude=lat,
            longitude=lng
        )
        
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # Return merged DB data and B2B metrics to the frontend
        return {
            "id": new_report.id,
            "issue_type": new_report.issue_type,
            "severity": new_report.severity,
            "status": new_report.status,
            "description": new_report.description,
            "suggested_action": new_report.suggested_action,
            "priority_rating": ai_data.get("priority_rating", 5.0),
            "sla_estimate": ai_data.get("sla_estimate", "3-5 Days"),
            "confidence": ai_data.get("confidence", 0.90)
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions so FastAPI actually sends the 429 status code
        raise
    except Exception as e:
        print(f"Error in create_report: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error during upload")

@app.patch("/api/reports/{report_id}/status")
def update_status(report_id: int, status: str = Form(...), db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    db.commit()
    return {"message": "Status updated"}

@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Attempt to delete the image file to save space
    if os.path.exists(report.image_path):
        try:
            os.remove(report.image_path)
        except:
            pass
            
    db.delete(report)
    db.commit()
    return {"message": "Deleted"}