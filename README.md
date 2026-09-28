# Resume Analyzer

A local Resume Analyzer web application based on the supplied Gemini backend.

## What it does

The user pastes resume details into the web interface. The backend sends the text to Gemini 2.5 Flash and extracts:

- Name
- Email
- Phone Number
- Location
- Skills
- Education
- Projects
- Certifications
- Work Experience

## Project structure

```text
ResumeAnalyzer/
├── app.py
├── requirements.txt
├── .env.example
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Run locally

### 1. Open a terminal in this folder

```bash
cd ResumeAnalyzer
```

### 2. Create a virtual environment (recommended)

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install packages

```bash
pip install -r requirements.txt
```

### 4. Set your Gemini API key

Windows CMD:

```cmd
set GEMINI_API_KEY=YOUR_API_KEY
```

Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_API_KEY"
```

macOS/Linux:

```bash
export GEMINI_API_KEY="YOUR_API_KEY"
```

Do not put your real API key into frontend JavaScript or commit it to GitHub.

### 5. Start the application

```bash
python app.py
```

### 6. Open in browser

```text
http://127.0.0.1:5000
```

## Notes

The original uploaded backend was a command-line program using `input()` and `print()`. This project keeps its Gemini analysis logic but exposes it through a Flask `/analyze` endpoint so the HTML/CSS/JavaScript frontend can communicate with it.
