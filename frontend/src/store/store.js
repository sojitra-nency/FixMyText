import { configureStore } from '@reduxjs/toolkit'
import { textApi } from './api/textApi'
import { authApi } from './api/authApi'
import { userDataApi } from './api/userDataApi'
import { subscriptionApi } from './api/subscriptionApi'
import { passesApi } from './api/passesApi'
import authReducer from './slices/authSlice'
import { errorMiddleware } from './middleware/errorMiddleware'

export const store = configureStore({
  reducer: {
    [textApi.reducerPath]: textApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userDataApi.reducerPath]: userDataApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [passesApi.reducerPath]: passesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(textApi.middleware)
      .concat(authApi.middleware)
      .concat(userDataApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(passesApi.middleware)
      .concat(errorMiddleware),
})
