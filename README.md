# CRM Frontend

Frontend application for the CRM system built with React, Redux Toolkit, and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, defaults are set):
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

Development mode:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── features/        # Redux slices (feature-based)
│   ├── services/        # API calls and external services
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── store/           # Redux store configuration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Charts**: Recharts & Chart.js
- **Build Tool**: Vite


