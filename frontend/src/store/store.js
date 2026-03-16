import { configureStore } from '@reduxjs/toolkit'
import { textApi } from './api/textApi'
import { authApi } from './api/authApi'
import { userDataApi } from './api/userDataApi'
import authReducer from './slices/authSlice'
import { errorMiddleware } from './middleware/errorMiddleware'

export const store = configureStore({
  reducer: {
    [textApi.reducerPath]: textApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userDataApi.reducerPath]: userDataApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(textApi.middleware)
      .concat(authApi.middleware)
      .concat(userDataApi.middleware)
      .concat(errorMiddleware),
})
