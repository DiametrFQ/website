import { configureStore } from '@reduxjs/toolkit'
import counterSlice from "./counter/reducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']