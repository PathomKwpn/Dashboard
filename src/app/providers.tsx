import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default AppProviders;
