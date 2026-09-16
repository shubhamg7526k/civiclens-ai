import os
import shutil
import uuid

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import Report
from .ai_service import analyze_image
from .report_service import create_report


# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CivicLens AI",
    description="AI-powered civic issue reporting system",
    version="1.0"
)

# Configure CORS so your React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def root():
    return {"message": "CivicLens AI API is running"}


@app.post("/api/reports")
async def create_civic_report(
    image: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    db: Session = Depends(get_db)
):
    extension = os.path.splitext(image.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 1. Save the uploaded file safely
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    # Explicitly close the FastAPI upload file to prevent Windows locks
    image.file.close() 

    # 2. Analyze the image with AI
    try:
        ai_result = analyze_image(file_path)
        
    except Exception as e:
        # If AI fails, attempt to delete the corrupted/unused image
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except PermissionError:
            # Fixes WinError 32: If the AI model crashed mid-read, it might leave the file locked.
            # We catch it here so it doesn't break our HTTP 500 response below.
            print(f"Warning: Could not delete {file_path}. File is locked by another process.")

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # 3. Save the final report to the database
    report = create_report(
        db=db,
        image_path=file_path,
        ai_result=ai_result,
        latitude=latitude,
        longitude=longitude
    )

    return report


@app.get("/api/reports")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return reports


@app.get("/api/reports/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@app.patch("/api/reports/{report_id}/status")
def update_status(
    report_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    db.commit()
    db.refresh(report)
    
    return report