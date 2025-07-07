import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCuYevzhdqTZ3XVLkxE4r0EqA-paywMxto',
  authDomain: 'cartbuddies-1381d.firebaseapp.com',
  projectId: 'cartbuddies-1381d',
  storageBucket: 'cartbuddies-1381d.appspot.com',
  messagingSenderId: '96621480735',
  appId: '1:96621480735:web:6ba69cd504c13fceaffe2a',
  measurementId: 'G-9ZHK6LW7QH',
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
