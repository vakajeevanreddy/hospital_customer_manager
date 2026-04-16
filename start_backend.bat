@echo off
echo Starting AIVOA Backend...
cd Back_end
..\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
pause
