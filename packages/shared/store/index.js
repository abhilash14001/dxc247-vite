import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import cashoutTeamReducer from './cashoutTeamSlice';
import cardSelectionReducer from './slices/cardSelectionSlice';
import rouletteReducer from './slices/rouletteSlice';
import kbcReducer from './slices/kbcSlice';
import casinoReducer from './slices/casinoSlice';
import adminReducer from './admin/adminSlice';
import adminPasswordReducer from './admin/adminPasswordSlice';
import userReducer from './slices/userSlice';
import navigationReducer from './slices/navigationSlice';
import commonDataReducer from './slices/commonDataSlice';
import oddsDataReducer from './slices/oddsDataSlice';
import tokenExpirationMiddleware from './middleware/tokenExpirationMiddleware';
import userPasswordChangeMiddleware from './middleware/userPasswordChangeMiddleware';
import adminPasswordChangeMiddleware from './middleware/adminPasswordChangeMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ 'roulette', 'cardSelection', 'cashoutTeam', 'admin', 'adminPassword', 'commonData','user', 'oddsData','casino']
};


const rootReducer = combineReducers({
  cashoutTeam: cashoutTeamReducer,
  roulette: rouletteReducer,
  cardSelection: cardSelectionReducer,
  kbc: kbcReducer,
  casino: casinoReducer,
  admin: adminReducer,
  adminPassword: adminPasswordReducer,
  user:  userReducer,
  navigation: navigationReducer,
  commonData: commonDataReducer,
  oddsData: oddsDataReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',

  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(tokenExpirationMiddleware, userPasswordChangeMiddleware, adminPasswordChangeMiddleware),
});


export const persistor = persistStore(store);
export default store;
