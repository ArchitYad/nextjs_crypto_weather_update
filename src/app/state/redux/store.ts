// /state/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';
import notificationReducer from './notify/notificationsSlice'
export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;