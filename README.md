# OG Code

## Live Website
**Visit the platform:** [OG Code Platform](https://o-gproject.vercel.app/)

## Project Overview
OG Code is a comprehensive platform designed for algorithmic problem-solving and competitive programming. The platform allows users to:
- Solve coding challenges in various programming languages
- Submit solutions for automated testing
- View detailed feedback on code submissions
- Track progress through a personalized dashboard
- Analyze code performance and get AI-powered suggestions

## Features

### For Users
- **User Authentication:** Secure registration and login system
- **Problem Library:** Diverse collection of algorithmic problems
- **Code Editor:** Monaco-based editor with syntax highlighting
- **Submissions:** Track submission history and performance
- **Profiles:** User profiles with submission statistics
- **Real-time Feedback:** Immediate results on code submission

## Technical Architecture

### Frontend
- **Framework:** React.js with React Router for navigation
- **UI Components:** Custom components with NextUI and Tailwind CSS
- **Code Editor:** Monaco Editor for code writing and editing
- **State Management:** Context API for authentication and global state
- **API Integration:** Axios for API calls to the backend
- **Deployment:** Hosted on Vercel

### Backend
- **Framework:** Node.js with Express
- **Authentication:** JWT-based authentication
- **Database:** MongoDB for data storage
- **Code Execution:** Secure sandboxed environment for running user code
- **File Management:** Automated cleanup system to manage temporary files
- **AI Integration:** Code analysis capabilities
- **Deployment:** Hosted on Coolify

## Deployment Information

### Frontend Deployment (Vercel)
- **URL:** [https://o-gproject.vercel.app/](https://o-gproject.vercel.app/)
- **Deployment Method:** Vercel CI/CD pipeline
- **Environment Variables:** 
  - `REACT_APP_BACKEND_URI`: Points to the Coolify backend

### Backend Deployment (Coolify)
- **Features:** Automated scaling, containerization, and monitoring
- **Docker Integration:** Containerized deployment for consistent environments
- **File System:** Managed temporary file storage with automated cleanup

## Local Development Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Docker and Docker Compose (optional)

### Frontend Setup
```bash
# Navigate to frontend directory
cd OGproject/frontend

# Install dependencies
npm install

# Create .env file with backend URL
echo "REACT_APP_BACKEND_URI=http://localhost:5000" > .env

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd OGproject/backend

# Install dependencies
npm install

# Create .env file with required variables
echo "MONGODB_URI=mongodb://localhost:27017/ogcode
JWT_SECRET=yoursecretkey
PORT=5000" > .env

# Start development server
npm start
```

### Docker Setup
```bash
# Build and start all containers
docker-compose up --build

# Stop all containers
docker-compose down
```

## File Cleanup System
The backend implements a comprehensive file cleanup system that:
- Cleans up job-specific files after execution
- Removes old temporary files based on age
- Performs regular scheduled cleanup
- Maintains system health by preventing disk space issues

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments
- Special thanks to all contributors and testers
