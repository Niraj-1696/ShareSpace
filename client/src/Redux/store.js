import { configureStore } from "@reduxjs/toolkit";
import { loadersSlice } from "./loadersSlice"; // 👈 fix: default import

const store = configureStore({
  reducer: {
    loaders: loadersSlice.reducer,
  },
});

export default store;
