import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
  isReady: boolean;
}

const initialState: CounterState = {
  count: 15,
  isReady: false, // es como un estado de loading
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // los reducers son las acciones que queremos llamar desde cualquier lugar de la app
  reducers: {
    initCounterState(state, action: PayloadAction<number>) {
      if (state.isReady) return;
      state.count = action.payload;
      state.isReady = true;
    },

    addOne(state) {
      state.count++;
    },

    substractOne(state) {
      if (state.count == 0) return;
      state.count--;
    },

    resetCount(state, action: PayloadAction<number>) {
      if (action.payload < 0) action.payload = 0;

      state.count = action.payload;
    },
  },
});

export const { addOne, substractOne, resetCount, initCounterState } =
  counterSlice.actions;

export default counterSlice.reducer;
