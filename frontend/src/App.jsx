
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import "./App.css";

function App() {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    const [showSignup, setShowSignup] = useState(false);

    if (!token) {
        return showSignup ? (
            <Signup onLoginClick={() => setShowSignup(false)} />
        ) : (
            <Login onSignupClick={() => setShowSignup(true)} />
        );
    }

    if (path === "/medical-records") {
        return <MedicalRecords />;
    }

    if (path === "/prescriptions") {
        return <Prescriptions />;
    }

    return <Dashboard />;
}

export default App;
