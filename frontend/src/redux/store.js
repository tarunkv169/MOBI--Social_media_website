import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'


  const persistConfig = {
    key: 'store',
    version: 1,
    storage,
  }
  
      //hey here
  const rootReducer = combineReducers({
      auth:authSlice,
  })
      //bye

  const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    devTools: import.meta.env.MODE !== 'production', // Use import.meta.env.MODE instead of process.env.NODE_ENV
});

store.subscribe(() => {
  console.log("Store updated:", store.getState());
});
export default store;