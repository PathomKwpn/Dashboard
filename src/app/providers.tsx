import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <TooltipProvider>{children}</TooltipProvider>
    </Provider>
  );
};

export default AppProviders;
