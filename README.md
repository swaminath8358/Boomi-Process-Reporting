# Boomi Integration Dashboard

A comprehensive, responsive web application for monitoring and reporting on Boomi integration processes. Built with Node.js, Express, React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Backend Features
- **RESTful API** with Express.js and TypeScript
- **JWT Authentication** with role-based access control (Admin/Viewer)
- **Real-time Updates** via Socket.IO
- **Process Monitoring** with filtering, pagination, and sorting
- **Mock Data Generation** for realistic testing
- **Error Handling** and comprehensive logging
- **Rate Limiting** and security middleware

### Frontend Features
- **Modern React UI** with TypeScript and Tailwind CSS
- **Responsive Design** optimized for all devices
- **Dark/Light Mode** with system preference detection
- **Real-time Dashboard** with live process updates
- **Advanced Filtering** by environment, status, date range, trading partner
- **Interactive Charts** using Recharts
- **Process Detail Views** with execution logs and retry functionality
- **Search and Sort** capabilities
- **Error Boundary** handling

### Key Components
- **Dashboard Summary** - Success vs failure metrics, execution trends
- **Process Table** - Searchable, sortable, filterable process list
- **Error Detail Modal** - Stack traces and retry options
- **Environment Toggle** - Switch between Dev/Test/Prod views
- **Authentication** - Secure login with JWT tokens

## 📁 Project Structure

```
boomi-dashboard/
├── package.json                 # Root dependencies
├── server/                     # Backend API
│   ├── package.json
│   ├── .env.example
│   ├── index.js               # Main server file
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── processes.js       # Process CRUD operations
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   └── mockData.js        # Mock data generator
│   └── utils/
├── client/                    # Frontend React app
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   └── src/
│       ├── components/        # React components
│       ├── contexts/          # React contexts
│       ├── hooks/             # Custom hooks
│       ├── services/          # API services
│       ├── types/             # TypeScript types
│       ├── utils/             # Utility functions
│       └── App.tsx
├── docker-compose.yml         # Docker setup
├── Dockerfile                 # Docker configuration
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boomi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both backend (port 5000) and frontend (port 3000) concurrently.

### Manual Setup

#### Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (for future PostgreSQL integration)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boomi_dashboard
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Default Users

The application comes with pre-configured users:

| Username | Password | Role    |
|----------|----------|---------|
| admin    | password | admin   |
| viewer   | password | viewer  |

## 📊 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "email": "admin@company.com"
  }
}
```

### Process Endpoints

#### GET /api/processes
Get paginated list of processes with filtering.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `environment` - Filter by environment (Dev/Test/Prod)
- `status` - Filter by status (Success/Failed/In Progress/Warning)
- `tradingPartner` - Filter by trading partner
- `startDate` - Filter by start date (ISO string)
- `endDate` - Filter by end date (ISO string)
- `search` - Search in process name/ID/trading partner
- `sortBy` - Sort field (startTime/processName/status/environment)
- `sortOrder` - Sort order (asc/desc)

#### GET /api/processes/dashboard
Get dashboard summary statistics.

#### GET /api/processes/:id
Get detailed process information.

#### GET /api/processes/:id/logs
Get execution logs for a process.

#### POST /api/processes/:id/retry
Retry a failed process (admin only).

## 🔄 Real-time Features

The application uses Socket.IO for real-time updates:

- **Process Status Changes** - Live updates when processes complete
- **New Process Executions** - Real-time notifications
- **Dashboard Metrics** - Live statistics updates
- **Retry Operations** - Immediate feedback on retry actions

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

### Dark Mode
- System preference detection
- Manual toggle available
- Persistent user choice

### Accessibility
- WCAG 2.1 compliant
- Keyboard navigation
- Screen reader support
- High contrast support

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and start services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Docker Build

```bash
# Build the image
docker build -t boomi-dashboard .

# Run the container
docker run -p 3000:3000 -p 5000:5000 boomi-dashboard
```

## 📈 Monitoring & Analytics

### Dashboard Metrics
- **Success Rate** - Percentage of successful executions
- **Daily Trends** - 7-day execution history
- **Environment Breakdown** - Stats by environment
- **Average Execution Time** - Performance metrics
- **Real-time Status** - Live process monitoring

### Process Insights
- **Execution Logs** - Detailed step-by-step logs
- **Error Analytics** - Error patterns and frequencies
- **Performance Tracking** - Execution time trends
- **Trading Partner Analysis** - Partner-specific metrics

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Role-based Access Control** (Admin/Viewer permissions)
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Input Validation** using Joi schemas
- **XSS Protection** with Helmet.js
- **SQL Injection Prevention** (prepared for database integration)

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure secure JWT secrets
3. Set up HTTPS/SSL certificates
4. Configure production database
5. Set up monitoring and logging

### Build for Production
```bash
# Frontend build
cd client
npm run build

# Backend optimization
cd server
npm install --production
```

### Performance Optimizations
- **Gzip Compression** enabled
- **Static Asset Caching** configured
- **API Response Caching** for static data
- **Database Indexing** (for production database)
- **CDN Integration** ready

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests (when implemented)
cd server
npm test
```

### Test Coverage
- Unit tests for utilities and services
- Component testing with React Testing Library
- API endpoint testing
- Integration tests for authentication flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📋 Roadmap

### Upcoming Features
- [ ] PostgreSQL database integration
- [ ] Advanced reporting and exports
- [ ] Custom dashboard widgets
- [ ] Email notifications for failures
- [ ] Process scheduling interface
- [ ] Advanced analytics and insights
- [ ] Multi-tenant support
- [ ] SSO integration

### Technical Improvements
- [ ] Comprehensive test coverage
- [ ] Performance optimizations
- [ ] Enhanced error handling
- [ ] Internationalization (i18n)
- [ ] Advanced caching strategies

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Review the documentation
- Check existing discussions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Boomi Integration Monitoring**
