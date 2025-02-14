import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";

import HomePage from "./pages/Home";
import ProductPage from "./pages/Product";

import { useThemeStore } from "./store/useThemeStore";

export default function App() {
    const { theme } = useThemeStore() as { theme: string };
    return (
        <div
            className="min-h-screen bg-base-200 transition-colors duration-300"
            data-theme={theme}
        >
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}
