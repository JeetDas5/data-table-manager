import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: [
    {
      name: "John",
      email: "john@example.com",
      age: 30,
      role: "Devops Engineer",
    },
    {
      name: "Jane",
      email: "jane@example.com",
      age: 25,
      role: "Product Manager",
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
