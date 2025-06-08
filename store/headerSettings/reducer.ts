import { createSlice } from "@reduxjs/toolkit";
import { locale } from "@/types/i18n"; // Убедитесь, что путь правильный

export type InitialState = {
  language: locale,
}

const initialState: InitialState = {
  language: 'en', // Это может быть начальным значением или синхронизироваться с useLocale
}

const dataSlice = createSlice({
  name: "headerSettings", // Дайте слайсу уникальное имя
  initialState,
  reducers: {
    // setLanguage используется, если нужно синхронизировать Redux с текущей локалью
    // или если есть компоненты, которые не могут использовать useLocale
    setLanguage(state, {payload}: {payload: locale}) {
      state.language = payload
    },
  }
});

// export const { setLanguage, setMessages } = dataSlice.actions; // setMessages удалено
export const { setLanguage } = dataSlice.actions;
export default dataSlice.reducer;