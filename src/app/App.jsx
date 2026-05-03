import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "./AuthContext";

import Home from "../pages/Home";
import Curricular from "../pages/Curricular";
import CoCurricular from "../pages/CoCurricular";
import ExtraCurricular from "../pages/ExtraCurricular";
import Contact from "../pages/Contact";
import Budget from "../pages/Budget";
import Login from "../pages/Login";

export default function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }

    return (
        <AuthProvider>
            <div className="appShell">
                <Navbar theme={theme} onToggleTheme={toggleTheme} />

                <main className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/curricular" element={<Curricular />} />
                        <Route path="/co-curricular" element={<CoCurricular />} />
                        <Route path="/extra-curricular" element={<ExtraCurricular />} />
                        <Route path="/budget" element={
                            <ProtectedRoute>
                                <Budget />
                            </ProtectedRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </AuthProvider>
    );
}
