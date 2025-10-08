# 🚀 MERN Stack Todo Application

A beautiful, responsive, and feature-rich Todo List application built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Bootstrap CSS.

## ✨ Features

- **📝 Add Tasks**: Create new todos with title, description, priority, and due date
- **🎯 Priority Levels**: High, Medium, and Low priority tasks with color coding
- **📅 Due Dates**: Set and track due dates with overdue notifications
- **✅ Mark Complete**: Toggle task completion status
- **✏️ Edit Tasks**: Update existing tasks inline
- **🗑️ Delete Tasks**: Remove tasks you no longer need
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎨 Beautiful UI**: Modern gradient design with smooth animations
- **⚡ Real-time Updates**: Instant updates without page refresh

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Bootstrap 5** - CSS framework for responsive design
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client for API calls
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mern-todo-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 5000
   cd client && npm start    # Frontend on port 3000
   ```

## 📱 Usage

1. **Add a new task**: Fill out the form with task details
2. **Set priority**: Choose from High, Medium, or Low priority
3. **Set due date**: Optional due date for task tracking
4. **Mark complete**: Check the checkbox to mark tasks as done
5. **Edit tasks**: Click the edit button to modify existing tasks
6. **Delete tasks**: Remove tasks you no longer need

## 🎨 Design Features

- **Gradient Background**: Beautiful purple gradient background
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Color-coded Priorities**: Visual priority indicators
- **Responsive Layout**: Adapts to all screen sizes
- **Modern Typography**: Clean, readable fonts

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### GitHub Repository

1. **Initialize Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MERN Todo App"
   ```

2. **Add remote repository**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## 📁 Project Structure

```
mern-todo-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Custom styles
│   └── package.json
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bootstrap for the amazing CSS framework
- React team for the excellent library
- MongoDB for the flexible database
- All open-source contributors

---

**Happy Coding! 🎉**
