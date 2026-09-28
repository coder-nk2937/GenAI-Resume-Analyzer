from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
import os
import time
load_dotenv()
app = Flask(__name__)

MODEL_NAME = "gemini-3.6-flash"


for attempt in range(3):
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        break

    except Exception as e:
        if "503" in str(e) and attempt < 2:
            time.sleep(2 ** attempt)
        else:
            raise

PROMPT_TEMPLATE = """
Analyze the following resume.

Resume:
{resume_text}

Extract the following information:

1. Name
2. Email
3. Phone Number
4. Location
5. Skills
6. Education
7. Projects
8. Certifications
9. Work Experience

Present the result in a clear and organized format.
"""

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. Set it as an environment variable before starting the app."
        )
    return genai.Client(api_key=api_key)

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/analyze")
def analyze():
    data = request.get_json(silent=True) or {}
    resume_text = (data.get("resume_text") or "").strip()

    if not resume_text:
        return jsonify({"error": "Please paste your resume details first."}), 400

    if len(resume_text) > 50000:
        return jsonify({"error": "Resume text is too long. Please keep it below 50,000 characters."}), 400

    try:
        client = get_client()
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=PROMPT_TEMPLATE.format(resume_text=resume_text)
        )
        return jsonify({"result": response.text or "No result was returned."})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
