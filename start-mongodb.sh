#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if MongoDB container is already running
if docker ps | grep -q "mongo-caltracker"; then
    echo "MongoDB container is already running."
else
    # Check if MongoDB container exists but is stopped
    if docker ps -a | grep -q "mongo-caltracker"; then
        echo "Starting existing MongoDB container..."
        docker start mongo-caltracker
    else
        echo "Creating and starting MongoDB container..."
        docker run --name mongo-caltracker -p 27017:27017 -d mongo:latest
    fi
fi

echo "MongoDB is running at mongodb://localhost:27017/"
echo "To connect to the MongoDB shell, run: docker exec -it mongo-caltracker mongosh" 