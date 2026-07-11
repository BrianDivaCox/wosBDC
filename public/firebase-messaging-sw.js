importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBuw51XRkUz5sbr-i8DKiGUgMpAPSiR-vs",
  authDomain: "wos-dashboard-38d4c.firebaseapp.com",
  databaseURL: "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com",
  projectId: "wos-dashboard-38d4c",
  storageBucket: "wos-dashboard-38d4c.firebasestorage.app",
  messagingSenderId: "1041082078621",
  appId: "1:1041082078621:web:9cce2bb45b76fb86404b74"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'BDC Dashboard';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
