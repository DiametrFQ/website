import { createSlice } from "@reduxjs/toolkit";
import { locale } from "../../types/i18n.js";
import { AbstractIntlMessages } from "next-intl";

export type InitialState = {
  language: locale,
  messages: AbstractIntlMessages
}

const initialState: InitialState = {
  language: 'en',
  messages: {}
}

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setLanguage(state, {payload}: {payload: locale}) {
      state.language = payload
    },
    setMessages(state, {payload}: {payload: AbstractIntlMessages}) {
      state.messages = payload
    },
  }
});

export const { setLanguage, setMessages } = dataSlice.actions;
export default dataSlice.reducer;