import { React } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import "./App.css";
import Filters from "./components/Filters/Filters";
import TransactionList from "./components/Transaction/TransactionList/TransactionList";

function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Filters />} />
          </Routes>
        </NextThemesProvider>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
