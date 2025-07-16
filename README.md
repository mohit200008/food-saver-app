# 🍎 FoodSaver Mobile App

A React Native mobile application to help users track food items and prevent food waste by monitoring expiry dates.

## 🚀 Features

- **User Authentication** - Sign up and sign in with email/password
- **Add Food Items** - Track food with categories, expiry dates, and photos
- **View Food Items** - Clean list interface with expiry status indicators
- **Firebase Integration** - Real-time data sync with Firestore
- **Offline Support** - Works offline with local storage
- **Image Upload** - Add photos to food items

## 🛠️ Tech Stack

- **React Native** with Expo
- **Firebase** (Authentication, Firestore, Storage)
- **AsyncStorage** for offline persistence
- **React Navigation** for screen navigation

## 📱 Screenshots

- Login/Signup Screen
- Home Screen (Food Items List)
- Add Food Item Screen
- Item Detail Screen

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohit200008/food-saver-app.git
   cd food-saver-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage (for images)
   - Get your configuration from Project Settings

5. **Run the app**
   ```bash
   npx expo start
   ```

## 🔒 Security

⚠️ **Important**: Never commit your `.env` file to version control. The `.env` file is already added to `.gitignore` to prevent accidental commits.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── constants/          # App constants (colors, categories)
├── screens/           # Screen components
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── AddItemScreen.js
│   └── ItemDetailScreen.js
├── services/          # Firebase services
│   ├── firebase.js    # Firebase configuration
│   ├── authService.js # Authentication service
│   └── foodService.js # Food items service
└── utils/             # Utility functions
    └── dateUtils.js   # Date formatting utilities
```

## 🚀 Usage

1. **Sign up/Sign in** with your email and password
2. **Add food items** by tapping the + button
3. **View your items** on the home screen
4. **Track expiry dates** with color-coded status indicators
5. **Delete items** by tapping the trash icon

## 🔧 Configuration

### Firebase Configuration

The app uses Firebase for:
- **Authentication** - User sign up/sign in
- **Firestore** - Store food items data
- **Storage** - Store food item images

### Environment Variables

All sensitive configuration is stored in environment variables:
- `FIREBASE_API_KEY` - Your Firebase API key
- `FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `FIREBASE_APP_ID` - Your Firebase app ID

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure all environment variables are set correctly
   - Check Firebase project settings

2. **Authentication Issues**
   - Enable Email/Password authentication in Firebase Console
   - Check if user exists in Firebase Auth

3. **Firestore Index Error**
   - Create composite index for `foodItems` collection
   - Fields: `userId` (Ascending) + `expiryDate` (Ascending)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please open an issue on GitHub or contact the maintainer.

---

**Note**: This app is designed to help reduce food waste by keeping track of expiry dates. Always check food items manually before consumption. 