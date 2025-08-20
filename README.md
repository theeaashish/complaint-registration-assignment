# Complaint Registration System

A modern, full-stack complaint management system built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. This application allows users to submit complaints and provides an admin dashboard for managing and tracking complaint statuses.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Complaint Submission**: Users can submit complaints with categories and priority levels
- **Admin Dashboard**: Comprehensive admin panel for managing complaints
- **Status Management**: Track complaint status (Pending, In Progress, Resolved, Rejected)
- **Email Notifications**: Automatic email notifications for new complaints and status updates
- **Responsive Design**: Modern UI with dark/light theme support
- **Real-time Updates**: Toast notifications for user feedback
- **Data Validation**: Form validation using Zod schemas

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT-based authentication
- **Email**: Nodemailer for SMTP email sending
- **Notifications**: Sonner for toast notifications
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- **MongoDB** database (local or cloud)
- **Git** for version control

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/theeaashish/complaint-registration-assignment.git
cd complaint-registration-assignment
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/complaint-registration
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaint-registration

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@example.com

# Application URL (for production)
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB** on your system:
   - **Windows**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow the [official installation guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service**:
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Set MongoDB URI** in your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/complaint-registration
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a new cluster** and database
3. **Get your connection string** from the Atlas dashboard
4. **Update your `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaint-registration
   ```

## 📧 Email Configuration

The application sends email notifications for:
- New complaint submissions (to admin)
- Complaint status updates (to admin)

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update your `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin@example.com
   ```

### Other Email Providers

- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

## 🎯 How to Use the Application

### For Regular Users

1. **Registration/Login**:
   - Visit the application homepage
   - Click "Register" to create a new account
   - Or "Login" if you already have an account

2. **Submit a Complaint**:
   - Fill out the complaint form with:
     - Title (required)
     - Description (required)
     - Category (Technical, Billing, General, etc.)
     - Priority (Low, Medium, High, Critical)
   - Click "Submit Complaint"
   - You'll receive a confirmation message

3. **Track Complaints**:
   - View your submitted complaints on the dashboard
   - Check the status of each complaint
   - Receive email notifications for status updates

### For Administrators

**Default Admin Credentials**:
- **Email**: `admin@gmail.com`
- **Password**: `admin@123`

1. **Login as Admin**:
   - Use the admin credentials to access the admin dashboard

2. **Manage Complaints**:
   - View all submitted complaints in a table format
   - Update complaint status using the dropdown menu
   - Delete complaints using the trash icon
   - Get toast notifications for successful actions

3. **Status Options**:
   - **Pending**: Newly submitted complaints
   - **In Progress**: Complaints being worked on
   - **Resolved**: Completed complaints
   - **Rejected**: Complaints that cannot be processed

## 🏗️ Project Structure

```
complaint-registration/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── api/                     # API routes
│   │   └── complaints/          # Complaint API endpoints
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── global/                  # Global components
│   │   └── AdminDashboard/      # Admin dashboard component
│   └── ui/                      # UI components (shadcn/ui)
├── lib/                         # Utility functions
│   ├── db.ts                    # Database connection
│   ├── email.ts                 # Email functionality
│   ├── session.ts               # Session management
│   └── zodSchemas.ts            # Validation schemas
├── models/                      # MongoDB models
│   ├── complaint.ts             # Complaint model
│   └── user.ts                  # User model
├── public/                      # Static assets
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push your code** to GitHub
2. **Connect your repository** to [Vercel](https://vercel.com)
3. **Add environment variables** in Vercel dashboard
4. **Deploy** automatically

### Other Platforms

- **Netlify**: Connect GitHub repository and deploy
- **Railway**: Deploy with MongoDB addon
- **Heroku**: Use with MongoDB Atlas

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Clean and modern landing page with authentication options*

### Login Page
![Login Page](./screenshots/login.png)
*Secure login form with admin credentials displayed*

### Complaint Submission Form
![Complaint Form](./screenshots/complaint-form.png)
*User-friendly form for submitting complaints*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Comprehensive admin panel for managing complaints*

### Toast Notifications
![Toast Notifications](./screenshots/toast-notifications.png)
*Real-time feedback with Sonner toast notifications*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check if MongoDB is running
   - Verify MONGODB_URI in `.env`
   - Ensure network access for MongoDB Atlas

2. **Email Not Sending**:
   - Verify SMTP credentials
   - Check if 2FA is enabled and app password is used
   - Ensure firewall allows SMTP connections

3. **Build Errors**:
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all environment variables are set

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are correctly set
3. Ensure all dependencies are installed
4. Check MongoDB connection and email configuration

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ using Next.js and modern web technologies**
