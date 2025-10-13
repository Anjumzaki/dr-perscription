# Dr. Prescription - SaaS for Doctors

A modern SaaS application that allows doctors to create, manage, and track digital prescriptions for their patients.

## Features

- **Doctor Authentication**: Secure registration and login for medical professionals
- **Prescription Management**: Create, view, edit, and delete prescriptions
- **Patient Information**: Store comprehensive patient details
- **Medication Tracking**: Add multiple medications with dosage, frequency, and duration
- **Diagnosis Records**: Record patient diagnosis and additional notes
- **Prescription Numbers**: Automatic generation of unique prescription numbers

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** framework
- **MongoDB** with **Mongoose ODM**
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **CSS-in-JS** for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dr-perscription
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. **Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dr-prescription
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

2. **MongoDB Setup**
   - Install MongoDB locally or create a MongoDB Atlas account
   - Update the `MONGODB_URI` in your `.env` file

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the Frontend Application**
   ```bash
   cd client
   npm start
   ```
   The client will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new doctor
- `POST /api/auth/login` - Login doctor

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions for authenticated doctor
- `POST /api/prescriptions` - Create a new prescription
- `GET /api/prescriptions/:id` - Get specific prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

## Usage

1. **Register/Login**: Create a doctor account or login with existing credentials
2. **Dashboard**: View overview and navigation options
3. **Create Prescription**: Fill out patient information, add medications, and specify diagnosis
4. **View Prescriptions**: Browse all created prescriptions with patient and medication details
5. **Manage Prescriptions**: Edit or delete existing prescriptions

## Project Structure

```
dr-perscription/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── server.ts      # Main server file
│   └── package.json
└── README.md
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes requiring authentication
- Input validation on both client and server
- CORS configuration

## Future Enhancements

- Email notifications for prescriptions
- PDF generation for prescriptions
- Patient portal access
- Prescription history and analytics
- Drug interaction checking
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.