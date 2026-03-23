import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null },
  reducers: {
    tokenRefreshed(state, { payload }) {
      state.accessToken = payload
    },
    logout(state) {
      state.user = null
      state.accessToken = null
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.accessToken = payload.access_token
    })
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
      state.accessToken = payload.access_token
    })
    builder.addMatcher(authApi.endpoints.refresh.matchFulfilled, (state, { payload }) => {
      state.accessToken = payload.access_token
    })
    builder.addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
      state.user = payload
    })
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null
      state.accessToken = null
    })
  },
})

export const { tokenRefreshed, logout } = authSlice.actions
export default authSlice.reducer
