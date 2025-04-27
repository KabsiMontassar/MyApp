@echo off
echo Starting Plant Disease Detection API Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

REM Change to the script directory
cd %~dp0

REM Check if requirements are installed
echo Checking required packages...
python -c "import tensorflow, flask, flask_cors, cv2" >nul 2>&1
if %errorlevel% neq 0 (
    echo Some required packages are missing. Installing now...
    python -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo Error installing required packages.
        pause
        exit /b 1
    )
)

REM Check if model file exists
if not exist "PDD_completemodel.h5" (
    echo Error: Model file not found.
    echo Please ensure PDD_completemodel.h5 is in this directory.
    pause
    exit /b 1
)

REM Check if class labels file exists
if not exist "class_labels.json" (
    echo Error: Class labels file not found.
    echo Please ensure class_labels.json is in this directory.
    pause
    exit /b 1
)

echo Starting server...
echo.
echo ==============================================
echo Plant Disease Detection Server is starting...
echo The server will be available at http://localhost:5000
echo.
echo If you see any error messages, please report them.
echo.
echo To stop the server, press CTRL+C in this window.
echo ==============================================
echo.

REM Start API server
python api_server.py

pause
