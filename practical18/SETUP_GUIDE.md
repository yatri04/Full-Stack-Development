# 🚀 Complete Setup Guide for MERN Todo Application

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
3. **Git** - [Download here](https://git-scm.com/downloads)
4. **Firebase CLI** - Already installed via npm

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Backend (Terminal 1)
npm run server

# Frontend (Terminal 2)
cd client && npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🚀 Firebase Deployment

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firebase Hosting

### 2. Configure Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select hosting)
firebase init hosting

# Follow the prompts:
# - Select your Firebase project
# - Public directory: client/build
# - Single-page app: Yes
# - Overwrite index.html: No
```

### 3. Update Firebase Configuration

Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4. Deploy to Firebase

```bash
# Build and deploy
npm run build
firebase deploy

# Or use the deployment script
# Windows:
deploy.bat

# Linux/Mac:
chmod +x deploy.sh
./deploy.sh
```

## 📱 GitHub Repository Setup

### 1. Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MERN Todo App with Bootstrap"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `mern-todo-app` (or your preferred name)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 3. Connect Local Repository to GitHub

```bash
# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mern-todo-app.git

# Push to GitHub
git push -u origin main
```

### 4. Update README with Live Demo

Add a live demo link to your README.md:

```markdown
## 🌐 Live Demo

[View Live Application](https://your-firebase-project-id.web.app)
```

## 🎨 Customization

### 1. Change Colors and Theme

Edit `client/src/App.css` to customize:
- Gradient colors
- Card styles
- Button styles
- Animations

### 2. Add New Features

- **Categories**: Add task categories
- **Tags**: Add custom tags
- **Search**: Add search functionality
- **Filters**: Add priority and date filters
- **Export**: Export tasks to CSV/PDF

### 3. Database Options

**MongoDB Atlas (Recommended for production)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

**Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

3. **Build errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Firebase deployment failed**
   ```bash
   # Re-authenticate
   firebase logout
   firebase login
   ```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**
