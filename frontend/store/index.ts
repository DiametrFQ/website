import { configureStore } from '@reduxjs/toolkit'
import headerSettingsSlice from "./headerSettings/reducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      headerSettings: headerSettingsSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']