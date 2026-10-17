import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Main from "./components/Main/Main";
import { I18nProvider } from "./i18n/I18n";
import "./App.css";

function App() {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <I18nProvider>
          <Main />
        </I18nProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export default App;
