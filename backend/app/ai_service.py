import os
import json

from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel(
    "gemini-3.6-flash"
)


def analyze_image(image_path):

    image = Image.open(image_path)

    prompt = """
You are CivicLens AI, an AI system that analyzes
images of public infrastructure problems.

Analyze this image and identify whether it contains
a civic or infrastructure issue.

Possible issue types:

- Pothole
- Garbage
- Broken Streetlight
- Water Leakage
- Drainage Problem
- Damaged Road
- Fallen Tree
- Construction Hazard
- Traffic/Safety Problem
- Other
- No Issue

Return ONLY valid JSON.

Required format:

{
    "issue_type": "Pothole",
    "severity": "High",
    "confidence": 0.95,
    "description": "Short explanation",
    "suggested_action": "Recommended action"
}

Severity must be:

Low
Medium
High
Critical
"""

    response = model.generate_content(
        [prompt, image]
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return json.loads(text)