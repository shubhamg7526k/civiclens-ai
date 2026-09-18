import os
import json
import re
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3.6-flash') # Using your specified hackathon model

def analyze_image(image_path: str):
    try:
        img = Image.open(image_path)
        
        # B2B Prompt matching your frontend dashboard
        prompt = """
        Analyze this image for public infrastructure damage (like potholes, broken streetlights, illegal dumping, etc.).
        Return ONLY a JSON object with the following exact keys. Do not use markdown backticks.
        {
            "issue_type": "string (e.g., Severe Roadway Pothole)",
            "severity": "string (Critical, High, Medium, Low)",
            "priority_rating": "float (e.g., 8.9)",
            "sla_estimate": "string (e.g., < 24 Hours)",
            "confidence": "float (e.g., 0.98)",
            "description": "string (brief technical assessment)",
            "suggested_action": "string (recommended repair action)"
        }
        If there is no infrastructure issue detected, set severity to "Low", priority_rating to 1.0, and state "No Issue".
        """
        
        response = model.generate_content([prompt, img])
        raw_text = response.text
        
        # THE FIX: Strip out markdown formatting (```json ... ```) if Gemini adds it
        cleaned_text = re.sub(r'```(?:json)?\n(.*?)\n```', r'\1', raw_text, flags=re.DOTALL)
        
        try:
            # Safely parse the cleaned text into a Python dictionary
            data = json.loads(cleaned_text.strip())
            return data
        except json.JSONDecodeError:
            print("Failed to parse JSON. Raw output from Gemini was:", raw_text)
            # Safe fallback so your server doesn't crash
            return {
                "issue_type": "Analysis Failed",
                "severity": "Medium",
                "priority_rating": 5.0,
                "sla_estimate": "3-5 Days",
                "confidence": 0.0,
                "description": "AI returned an invalid format.",
                "suggested_action": "Manual review required."
            }
            
    except Exception as e:
        error_msg = str(e)
        print(f"AI Service Error: {error_msg}")
        
        # Professionally catch rate limits (429) vs standard errors
        if "429" in error_msg or "Quota" in error_msg or "rate limit" in error_msg.lower():
            return {"error": "rate_limit", "message": "AI rate limit exceeded."}
            
        return {"error": "internal", "message": "Failed to process image."}