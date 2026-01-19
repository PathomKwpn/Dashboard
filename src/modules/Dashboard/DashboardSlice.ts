import { createSlice } from "@reduxjs/toolkit"

interface DashboardState {
  totalEvents: number
  critical: number
  loading: boolean
}

const initialState: DashboardState = {
  totalEvents: 0,
  critical: 0,
  loading: false,
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSummary(state, action) {
      state.totalEvents = action.payload.totalEvents
      state.critical = action.payload.critical
    },
  },
})

export const { setSummary } = dashboardSlice.actions
export default dashboardSlice.reducer
