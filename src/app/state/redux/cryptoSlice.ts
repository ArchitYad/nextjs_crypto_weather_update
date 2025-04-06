// /state/redux/cryptoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoData {
  name: string;
  price: number;
}

interface Alert {
  type: string;
  message: string;
}

interface CryptoState {
  data: CryptoData[];  
  alert: Alert | null;  
}

const initialState: CryptoState = {
  data: [],  
  alert: null,  
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {

    updateCryptoData: (state, action: PayloadAction<CryptoData>) => {
      const existing = state.data.find(c => c.name === action.payload.name);
      if (existing) {
        existing.price = action.payload.price;  
      } else {
        state.data.push(action.payload);  
      }
    },
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload;  
    },
    clearAlert: (state) => {
      state.alert = null;  
    },
  },
});

export const { updateCryptoData, setAlert, clearAlert } = cryptoSlice.actions;
export default cryptoSlice.reducer;