# 🍎 FoodSaver Mobile App

A React Native mobile application built with Expo to help users reduce food waste by tracking food items, managing expiration dates, and getting timely alerts.

## 📱 Features

### 🔐 Authentication
- Email/password-based authentication
- Secure user sessions
- Automatic login state management

### 🥘 Food Management
- **Add Food Items**: Capture food photos, set names, categories, and expiry dates
- **Edit Items**: Modify existing food item details
- **Delete Items**: Remove consumed or expired items
- **Visual Status**: Color-coded indicators for expiry status

### 📸 Image Handling
- Camera integration for taking food photos
- Gallery access for selecting existing images
- Automatic image upload to Firebase Storage
- Optimized image compression and storage

### 🔔 Smart Alerts
- **Expiry Tracking**: Automatic calculation of days until expiry
- **Status Categories**: 
  - 🟢 Fresh (7+ days)
  - 🟡 Expiring This Week (4-7 days)
  - 🟠 Expiring Soon (1-3 days)
  - 🔴 Expired (past due)

### 🏷️ Food Categories
- Dairy & Eggs 🥛
- Meat & Fish 🥩
- Vegetables 🥬
- Fruits 🍎
- Grains & Bread 🍞
- Beverages 🥤
- Snacks 🍿
- Frozen Foods 🧊
- Canned Goods 🥫
- Condiments 🧂
- Other 📦

## 🛠️ Technology Stack

### Core Technologies
- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **React Navigation** - Screen navigation

### Key Libraries
- `@react-navigation/native` - Navigation framework
- `@react-navigation/stack` - Stack navigation
- `firebase` - Firebase SDK
- `expo-image-picker` - Image selection and camera
- `expo-notifications` - Push notifications
- `@react-native-community/datetimepicker` - Date/time selection
- `@expo/vector-icons` - Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoodSaverMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Update `src/services/firebase.js` with your Firebase config

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal
   - Or press 'a' for Android emulator or 'i' for iOS simulator

## 🔧 Firebase Configuration

### Required Services

1. **Authentication**
   - Enable Email/Password sign-in method
   - Configure user management rules

2. **Firestore Database**
   - Create collection: `foodItems`
   - Set up security rules for user data isolation

3. **Storage**
   - Create bucket for food images
   - Configure security rules for image uploads

### Security Rules Example

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /foodItems/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /food-images/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
FoodSaverMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configurations
│   │   ├── colors.js        # Color scheme
│   │   └── categories.js    # Food categories
│   ├── screens/             # App screens
│   │   ├── LoginScreen.js   # Authentication screen
│   │   ├── HomeScreen.js    # Main food list screen
│   │   ├── AddItemScreen.js # Add new food item
│   │   └── ItemDetailScreen.js # Food item details
│   ├── services/            # API and service functions
│   │   ├── firebase.js      # Firebase configuration
│   │   ├── authService.js   # Authentication service
│   │   └── foodService.js   # Food data management
│   └── utils/               # Utility functions
│       └── dateUtils.js     # Date handling utilities
├── assets/                  # Static assets
├── App.js                   # Main app component
└── package.json             # Dependencies
```

## 📱 App Screens

### 1. Login Screen
- Email/password authentication
- Sign up and sign in functionality
- Form validation and error handling

### 2. Home Screen
- List of all food items
- Pull-to-refresh functionality
- Floating action button to add items
- Color-coded expiry status
- Swipe to delete items

### 3. Add Item Screen
- Camera and gallery image selection
- Food name input
- Category selection with icons
- Date picker for expiry date
- Form validation

### 4. Item Detail Screen
- Full food item details
- Edit mode for updating information
- Delete functionality
- Status indicators

## 🎨 Design System

### Color Palette
- **Primary**: #4CAF50 (Green)
- **Secondary**: #FF9800 (Orange)
- **Background**: #F5F5F5 (Light Gray)
- **Surface**: #FFFFFF (White)
- **Text**: #212121 (Dark Gray)
- **Error**: #F44336 (Red)

### Status Colors
- **Fresh**: #4CAF50 (Green)
- **Expiring Soon**: #FF9800 (Orange)
- **Expired**: #F44336 (Red)

## 🔄 Data Flow

1. **Authentication**: User signs in → Firebase Auth → App state updates
2. **Add Item**: User inputs data → Image upload → Firestore save → UI updates
3. **View Items**: App loads → Firestore query → FlatList render
4. **Edit Item**: User modifies → Firestore update → UI refresh
5. **Delete Item**: User confirms → Firestore delete → List refresh

## 🚀 Deployment

### Expo Build
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

### App Store Deployment
1. Configure app.json with proper app details
2. Build production version
3. Submit to App Store/Google Play Store

## 🔮 Future Enhancements

### Planned Features
- **Push Notifications**: Expiry alerts and reminders
- **Barcode Scanning**: Automatic product identification
- **Recipe Suggestions**: Based on available ingredients
- **Shopping List**: Integration with food tracking
- **Analytics**: Food waste statistics and insights
- **Multi-language Support**: Internationalization
- **Offline Support**: Local data caching

### Technical Improvements
- **Performance**: Image optimization and lazy loading
- **Testing**: Unit and integration tests
- **CI/CD**: Automated build and deployment
- **Analytics**: User behavior tracking
- **Crash Reporting**: Error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the excellent development platform
- **Firebase Team** - For robust backend services
- **React Native Community** - For the amazing ecosystem
- **Open Source Contributors** - For inspiration and support

---

**Made with ❤️ for a sustainable future**

🍎 Reduce food waste, save money, protect the environment! 