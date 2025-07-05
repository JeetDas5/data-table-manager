import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: [
    {
      name: "Jeet",
      email: "jeet@example.com",
      age: 20,
      role: "Frontend Developer",
    },
  ],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<DataTableType[]>) {
      state.data = action.payload;
    },
  },
});

export const { setData } = tableSlice.actions;
export const tableReducer = tableSlice.reducer;
