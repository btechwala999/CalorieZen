@echo off
echo Checking if Docker is installed...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

echo Checking if MongoDB container is already running...
docker ps | findstr "mongo-caltracker" >nul
if %errorlevel% equ 0 (
    echo MongoDB container is already running.
) else (
    echo Checking if MongoDB container exists but is stopped...
    docker ps -a | findstr "mongo-caltracker" >nul
    if %errorlevel% equ 0 (
        echo Starting existing MongoDB container...
        docker start mongo-caltracker
    ) else (
        echo Creating and starting MongoDB container...
        docker run --name mongo-caltracker -p 27017:27017 -d mongo:latest
    )
)

echo MongoDB is running at mongodb://localhost:27017/
echo To connect to the MongoDB shell, run: docker exec -it mongo-caltracker mongosh
pause 