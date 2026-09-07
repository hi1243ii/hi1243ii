"use client";

import * as React from "react";

const OnlineContext = React.createContext(true);

export function OnlineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = React.useState(true);

  React.useEffect(() => {
    setOnline(window.navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return <OnlineContext.Provider value={online}>{children}</OnlineContext.Provider>;
}

export function useOnline() {
  return React.useContext(OnlineContext);
}
