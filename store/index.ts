import { configureStore } from '@reduxjs/toolkit'
import counterSlice from "./counter/reducer";
import headerSettingsSlice from "./headerSettings/reducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      headerSettings: headerSettingsSlice,
      counter: counterSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']