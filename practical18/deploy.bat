@echo off
echo Building React application...
cd client
call npm run build
cd ..

echo Deploying to Firebase...
firebase deploy

echo Deployment complete!
pause
