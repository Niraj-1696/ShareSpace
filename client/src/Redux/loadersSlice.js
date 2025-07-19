import { createSlice } from "@reduxjs/toolkit";

export const loadersSlice = createSlice({
  name: "loaders",
  initialState: {
    loading: false,
  },
  reducers: {
    Setloader: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { Setloader } = loadersSlice.actions;
