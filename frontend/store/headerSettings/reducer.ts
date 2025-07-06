import { createSlice } from "@reduxjs/toolkit";
import { locale } from "@/types/i18n";

export type InitialState = {
  language: locale,
}

const initialState: InitialState = {
  language: 'en',
}

const dataSlice = createSlice({
  name: "headerSettings",
  initialState,
  reducers: {
    setLanguage(state, {payload}: {payload: locale}) {
      state.language = payload
    },
  }
});

export const { setLanguage } = dataSlice.actions;
export default dataSlice.reducer;