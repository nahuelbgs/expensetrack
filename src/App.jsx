import { React } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Main from "./components/Main/Main";
import "./App.css";

function App() {
  return (
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Main />
        </NextThemesProvider>
      </NextUIProvider>
  );
}

export default App;
