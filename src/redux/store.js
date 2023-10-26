import { combineReducers, configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../components/notifications/slice/notification";

let preloadedState = {};

const appReducers = combineReducers({
  notif: notificationReducer,
});

const rootReducer = (state, action) => {
  return appReducers(state, action);
};

export default configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
