import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  severity: "info",
  message: "",
  key: new Date().getTime(),
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    openNotification: (state, action) => {
      return {
        ...state,
        ...action.payload,
        key: new Date().getTime(),
        open: true,
      };
    },
    closeNotification: (state) => {
      return { ...state, ...initialState };
    },
  },
});

export const { openNotification, closeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
