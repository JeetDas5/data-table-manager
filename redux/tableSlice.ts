import { createSlice,PayloadAction } from "@reduxjs/toolkit";

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
    addRow: (state, action) => {
      state.data.push(action.payload);
    },
    deleteRow: (state, action) => {
      state.data = state.data.filter((_, index) => index !== action.payload);
    },
    updateRow: (state, action) => {
      const { index, newData } = action.payload;
      state.data[index] = newData;
    },
    setData(state, action: PayloadAction<DataTableType[]>) {
      state.data = action.payload;
    },
  },
});

export const { addRow, deleteRow, updateRow, setData } = tableSlice.actions;
export const tableReducer = tableSlice.reducer;
