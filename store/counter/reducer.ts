import { createSlice } from "@reduxjs/toolkit";

export type InitialState = {
  count: number
}

const initialState: InitialState = {
  count: 0
}

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    plusQuestNode(state, {payload}: {payload: number}) {
      state.count += payload
    },
    minusQuestNode(state, {payload}: {payload: number}) {
      state.count -= payload
    },
  }
});

export const { plusQuestNode, minusQuestNode } = dataSlice.actions;
export default dataSlice.reducer;