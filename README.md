# OrderFlow - Order Management App

A React Native mobile application for managing customer orders in small businesses, with real-time updates and intuitive status tracking.

## About

OrderFlow streamlines the order management process for small businesses like cafes, bakeries, and takeaway shops. Staff can quickly create, track, and update customer orders with a mobile-first design optimized for speed during busy periods.

## Features

- **Order Management**: Create, view, edit, and delete customer orders
- **Status Tracking**: Track orders through four stages (New → Processing → Ready → Collected)
- **Real-time Updates**: Live synchronization across all devices using Firebase
- **Search & Filter**: Find orders by customer name or phone number
- **Mobile Optimized**: Touch-friendly interface designed for phones and tablets

## Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Authentication + Firestore)
- **Navigation**: React Navigation v6
- **Development**: Expo CLI

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/OrderFlow.git
   cd OrderFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy your config from Project Settings > General > Your apps
   - Update `src/config/firebase.ts` with your Firebase configuration

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - **iOS**: Press `i` in terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal (limited functionality)

## Design

OrderFlow follows a clean, mobile-first design with:

- **Colors**: Teal primary (#006D77), coral accents (#E07A5F), cream backgrounds (#F8F9FA)
- **Typography**: System fonts optimized for readability
- **Spacing**: 8pt grid system for consistent layouts
- **Accessibility**: WCAG AA compliance with 44pt minimum touch targets

## 📁 Project Structure

```
OrderFlow/
├── src/
│   ├── screens/          # Main app screens
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation configuration
│   ├── types/           # TypeScript type definitions
│   └── config/          # App configuration (Firebase, etc.)
├── assets/              # Images, fonts, and other assets
├── App.tsx             # Root component
└── package.json        # Dependencies and scripts
```

## Firebase Setup

### Authentication
- Email/password authentication for staff members
- Session persistence for convenience

### Firestore Collections

**Users Collection** (`users`)
```javascript
{
  id: string,
  email: string,
  displayName?: string,
  createdAt: timestamp
}
```

**Orders Collection** (`orders`)
```javascript
{
  id: string,
  customerName: string,
  phone: string,
  notes?: string,
  status: 'new' | 'processing' | 'ready' | 'collected',
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string,
  history: [
    {
      status: string,
      timestamp: timestamp,
      userId: string
    }
  ]
}
```

### Security Rules
```javascript
// Allow authenticated users to read/write orders
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

### Adding New Features

1. Create new screens in `src/screens/`
2. Add navigation routes in `src/navigation/AppNavigator.tsx`
3. Update TypeScript types in `src/types/index.ts`
4. Test on both iOS and Android platforms

## Screens

- **Login**: Staff authentication
- **Dashboard**: Orders list with search and filters
- **Order Detail**: View and update individual orders
- **Add Order**: Create new customer orders
- **Profile**: User settings and logout

## Testing

### Manual Testing Checklist

- [ ] Login with valid/invalid credentials
- [ ] Create new orders with required fields
- [ ] Update order status (New → Processing → Ready → Collected)
- [ ] Search orders by customer name and phone
- [ ] Filter orders by status
- [ ] Edit existing order details
- [ ] Delete orders with confirmation
- [ ] Real-time updates across multiple devices

### Device Testing

- [ ] iPhone (various sizes)
- [ ] Android phone
- [ ] Tablet (iPad/Android)
- [ ] Different network conditions

## Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**Firebase permission denied**
- Check Firestore security rules
- Verify user is authenticated
- Ensure Firebase config is correct

**App won't load on device**
- Ensure device and computer are on same Wi-Fi
- Try tunnel mode: `npx expo start --tunnel`
- Clear Expo cache: `npx expo start --clear`

## Contributing

This is Group D project and Steps For team members:

1. Create feature branches for new work **DO NOT WORK ON MAIN BRANCH**
2. Test thoroughly before merging
3. Write clear commit messages
4. Update documentation as needed

## License

This project is for educational purposes as part of university coursework.

## Team

- **Yvonne Gitonga**: [Role]
- **Hui-Yun LO Wendy**: [Role]  
- **Tausif Rahman**: [Role]

---

**Built with React Native + Expo | OrderFlow 2025**
