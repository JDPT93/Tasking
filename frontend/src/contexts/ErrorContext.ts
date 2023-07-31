import * as React from "react";

export interface ErrorContext {
  error: Error | null;
  setError: (Error: Error | null) => void;
}

export default React.createContext<ErrorContext>({} as ErrorContext);
