# FeedRecap Mobile App

![FeedRecap Logo](https://www.feedrecap.com/icons8-feed-50.png)

**FeedRecap Mobile App** is the official React Native application for FeedRecap, an AI-powered newsletter platform that curates top tweets from Twitter and delivers them to your inbox. Stay updated on trending topics or customize your feed with specific Twitter profiles right from your mobile device. The app provides a seamless experience with an intuitive dashboard, flexible settings, and real-time notifications.

This is the mobile app version of the main FeedRecap project. Check out the web project here: [FeedRecap Web](https://github.com/hasanpeal/FeedRecap).

The app is already published on the Android Google Play Store. Download it here: [FeedRecap on Google Play Store](https://play.google.com/store/apps/details?id=com.pealhasan.FeedRecap&pcampaignid=web_share).

---

## 🚀 Live Demo

🌐 **Website**: [FeedRecap](https://www.feedrecap.com)

📱 **Download**: [FeedRecap on Google Play Store](https://play.google.com/store/apps/details?id=com.pealhasan.FeedRecap&pcampaignid=web_share)

🔗 **Repository**: [GitHub - FeedRecap Mobile](https://github.com/hasanpeal/FeedRecapMobile.git)

---

## ✨ Features

### 📰 **Category Mode**
- Choose from predefined categories:
  - **Politics**
  - **Geopolitics**
  - **Finance**
  - **AI**
  - **Tech**
  - **Crypto**
  - **Meme**
  - **Sports**
  - **Entertainment**
- Set your newsletter delivery times (Morning, Afternoon, Night).
- Receive AI-curated newsletters with the top 15 tweets from your selected categories.

### 🔧 **Custom Profile Mode**
- Add Twitter profiles via an auto-suggestion feature.
- Follow unlimited Twitter profiles.
- Get newsletters curated based on your custom profile feed.

### 📊 **Dashboard**
- Access a personalized dashboard with these tabs:
  1. **Feed**: View top tweets from your selected categories or custom profiles.
  2. **Newsletter**: Access your latest newsletters.
  3. **Settings**: Update categories, custom profiles, delivery preferences, and timezone.

### 📩 **Newsletter Features**
- **Top Tweets**: Curated top tweets of the day.
- **Share**: Share newsletters or tweets directly via WhatsApp, Telegram, or Email.
- **Web Link**: View newsletters online and share them with friends.

### 🔔 **Notifications**
- Get push notifications for:
  - New newsletters.
  - Updates to your categories or profiles.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React Native, Expo
- **Navigation**: React Navigation
- **Language**: TypeScript
- **State Management**: Context API
- **Styling**: Styled Components

### **Backend**
- **Framework**: Express.js (Integrated with FeedRecap backend)
- **Authentication**: Google OAuth, Email-based login with two-step verification
- **Database**: MongoDB
- **Session Management**: Redis store, Express session
- **API**: Axios, SendGrid
- **Automation**: Node Cron for scheduling tasks
- **Generative AI**: Gemini

### **Other Tools**
- **Push Notifications**: Expo Notifications
- **Testing**: Jest, React Native Testing Library
- **Development**: Expo CLI

---

## 🗂️ Project Structure

```plaintext
FeedRecap-Mobile/
├── app/             # Core app components and screens
│   ├── (tabs)/      # Tab navigation components (feed, newsletter, settings)
│   ├── index.tsx    # Main entry point
│   ├── signin.jsx   # Sign-in screen
│   ├── signup.jsx   # Sign-up screen
│   ├── newuser.jsx  # New user setup
├── assets/          # Images, fonts, and other static assets
├── components/      # Reusable UI components
├── constants/       # Constants and configuration
├── hooks/           # Custom hooks for state and logic
├── scripts/         # Utility scripts
├── .env             # Environment variables
├── app.json         # Expo app configuration
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

---

## 🧑‍💻 Getting Started

### **Requirements**
- Node.js
- Expo CLI
- Android Studio or Xcode (for emulator testing)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/hasanpeal/FeedRecapMobile.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### **Run on Device or Emulator**
- For iOS:
  ```bash
  npm run ios
  ```
- For Android:
  ```bash
  npm run android
  ```

---

## 🔒 Authentication

### **Sign Up**
- Sign up with email and two-step verification.

### **Sign In**
- Login options:
  1. Email and password.
  2. Google OAuth.

---

## 🌟 Why Use FeedRecap Mobile App?

- **Real-Time Updates**: Get push notifications for new newsletters.
- **AI-Powered Insights**: Receive curated tweets from top categories and profiles.
- **Personalized Content**: Tailor your feed to match your interests.
- **Easy Sharing**: Share newsletters with friends instantly.
- **Mobile Convenience**: Access FeedRecap anytime, anywhere.

---

## 🔑 Keywords

React-Native FeedRecap mobile-newsletter-app AI-powered-newsletter personalized-newsletters trending-tweets custom-twitter-profiles Twitter-curation AI-curated-content social-media-news AI-newsletters category-based-news newsletters-for-mobile breaking-news-aggregator push-notifications-for-news Expo-CLI mobile-news-dashboard AI-tweet-curation React-Navigation Expo-notifications Jest-testing mobile-social-newsfeed curated-tweet-dashboard styled-components automation-with-node-cron Google-OAuth-authentication session-management-with-Redis SendGrid-integration Gemini-AI-for-news personalized-content delivery AI-curation-tools curated-social-feeds Expo-development newsletter-sharing React-Mobile-app social-media-newsletters Axios-integration time-based-newsletters news-sharing-platform trending-tweet-insights tailored-newsletters MongoDB-for-newsletter mobile-app-news-feed automation-for-newsletters AI-driven-news-app Expo-push-notifications

---

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌟 How to Contribute

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a pull request.

---

## ⭐ Support the Project
If you like this project, please consider **starring** 🌟 the repository on GitHub to support its growth and visibility!

---

## 📧 Contact

For questions or suggestions, feel free to reach out:
- **Author**: [Peal Hasan](https://www.linkedin.com/in/hasanpeal/)
- **Email**: [contact@feedrecap.com](mailto:contact@feedrecap.com)