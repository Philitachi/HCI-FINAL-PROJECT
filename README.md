# Fire Safety Inspection System

A modern, responsive web application and mobile app designed to facilitate the submission, tracking, and management of fire safety inspection applications, building permits, and public complaints.

## 🚀 Features

- **User Authentication**: Secure sign-up, sign-in, and password reset functionalities.
- **Dashboard & Tracking**: Users can monitor the status of their ongoing, completed, and cancelled applications.
- **Application Workflows**: Submit and track progress through stages: Completeness Check, Assessment, Pending Review, and Issuance.
- **Public Complaints**: A dedicated module for users to submit fire safety concerns or complaints.
- **Real-Time Notifications**: Get notified on status changes such as when applications are approved or declined.
- **Accessibility & Preferences**: Built-in Dark/Light mode toggle, dynamic font style switching (Outfit, Inter, Roboto, Nunito), and dynamic text resizing.
- **Cross-Platform**: Built as a responsive web app and deployable as a native Android app via Capacitor.

## 🛠️ Technology Stack

- **Frontend**: [React.js](https://reactjs.org/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Storage, Authentication)
- **Email Services**: [EmailJS](https://www.emailjs.com/) for automated platform notifications
- **Mobile Wrapper**: [Capacitor](https://capacitorjs.com/) (v8) for Android APK generation
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd HCI-FINAL-PROJECT
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your Firebase Config:
   - Ensure your `src/firebase.js` is properly configured with your Firebase project credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Mobile Build (Android)

This project uses Capacitor to generate an `.apk` file for Android devices.

1. Build the production web assets:
   ```bash
   npm run build
   ```

2. Sync the assets to Android:
   ```bash
   npx cap sync android
   ```

3. Open the project in Android Studio to build the APK:
   ```bash
   npx cap open android
   ```

## 📁 Project Structure

```text
src/
├── assets/         # Static images, logos, and global assets
├── components/     # Reusable UI components (Navigations, Modals, Loaders)
├── pages/          # Application views/routes (Dashboard, Forms, Tracking)
├── styles/         # Global and component-scoped CSS files
├── utils/          # Helper functions (Session management, etc.)
├── App.jsx         # Main application router
├── main.jsx        # Entry point
└── firebase.js     # Firebase configuration
```

## 🎨 UI/UX Highlights
- Uses **Glassmorphism** heavily on top navigation elements.
- Clean and consistent spacing with **Flexbox** and **CSS Grid**.
- Adheres to Mobile-First responsive design principles to ensure smooth tablet and smartphone experiences.

## 📄 License
This project was developed as a Final Project for the Human-Computer Interaction (HCI) course.
