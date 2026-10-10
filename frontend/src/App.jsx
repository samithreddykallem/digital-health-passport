import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import "./App.css";

function App() {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    if (!token) {
        return <Login />;
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