import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
};

type NotificationsState = Notification[];

const initialState: NotificationsState = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ message: string; type: 'info' | 'success' | 'warning' | 'error' }>
    ) => {
      const newNotification: Notification = {
        id: nanoid(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: new Date().toISOString(),
      };
      state.push(newNotification);

      if (state.length > 5) {
        state.shift();
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
    clearNotifications: () => {
      return [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
