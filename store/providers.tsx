"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { ColorModeProvider } from "../hooks/ThemeToggle";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </Provider>
  );
};
