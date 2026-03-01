import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface EventItem {
  id: string;
  message: string;
  risk: "critical" | "high" | "medium" | "low";
}

interface EventsState {
  list: EventItem[];
  loading: boolean;
}

const initialState: EventsState = {
  list: [],
  loading: false,
};

export const fetchEvents = createAsyncThunk("events/fetch", async () => {
  // mock API
  return [
    { id: "1", message: "Spike detected", risk: "critical" },
    { id: "2", message: "Normal activity", risk: "low" },
  ] as EventItem[];
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});

export default eventsSlice.reducer;
