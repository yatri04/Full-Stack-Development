#!/bin/bash

# Build the React app
echo "Building React application..."
cd client
npm run build
cd ..

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy

echo "Deployment complete!"
