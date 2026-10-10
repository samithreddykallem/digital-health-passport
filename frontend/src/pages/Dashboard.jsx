
import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";

function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        bloodGroup: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        emergencyContact: ""
    });

    const [saveMessage, setSaveMessage] = useState("");
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();

            setProfile(data);

            setFormData({
                bloodGroup: data.bloodGroup || "",
                dateOfBirth: data.dateOfBirth || "",
                gender: data.gender || "",
                address: data.address || "",
                emergencyContact: data.emergencyContact || ""
            });
        } catch (error) {
            console.error("Profile loading error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setSaveMessage("");
        setSaveError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedProfile = await response.json();

            setProfile(updatedProfile);
            setSaveMessage("Profile updated successfully!");
            setEditing(false);
        } catch (error) {
            console.error("Profile update error:", error);
            setSaveError(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const openMedicalRecords = () => {
        window.location.href = "/medical-records";
    };

    const openPrescriptions = () => {
        window.location.href = "/prescriptions";
    };

    if (loading) {
        return (
            <div className="loading-page">
                <h2>Loading your health passport...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="loading-page">
                <h2>Unable to load profile</h2>
                <p>{error}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Navigation */}
            <nav className="dashboard-navbar">
                <div className="logo">
                    Digital Health Passport
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            <main className="dashboard-content">
                <h1>
                    Welcome, {profile?.user?.name || "User"}
                </h1>

                <p className="dashboard-subtitle">
                    Manage your personal health information in one place.
                </p>

                {/* User Information */}
                <div className="profile-summary">
                    <div>
                        <span>Name</span>
                        <strong>
                            {profile?.user?.name || "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Email</span>
                        <strong>
                            {profile?.user?.email || "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Phone</span>
                        <strong>
                            {profile?.user?.phone || "Not available"}
                        </strong>
                    </div>
                </div>

                {/* Health Information */}
                <div className="health-info">
                    <div className="section-header">
                        <h2>Health Information</h2>

                        <button
                            className="edit-profile-button"
                            onClick={() => {
                                if (editing) {
                                    setFormData({
                                        bloodGroup: profile?.bloodGroup || "",
                                        dateOfBirth: profile?.dateOfBirth || "",
                                        gender: profile?.gender || "",
                                        address: profile?.address || "",
                                        emergencyContact:
                                            profile?.emergencyContact || ""
                                    });
                                }

                                setEditing(!editing);
                                setSaveMessage("");
                                setSaveError("");
                            }}
                        >
                            {editing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    {!editing ? (
                        <div className="health-details">
                            <div className="detail-card">
                                <span>Blood Group</span>
                                <strong>
                                    {profile?.bloodGroup || "Not added"}
                                </strong>
                            </div>

                            <div className="detail-card">
                                <span>Date of Birth</span>
                                <strong>
                                    {profile?.dateOfBirth || "Not added"}
                                </strong>
                            </div>

                            <div className="detail-card">
                                <span>Gender</span>
                                <strong>
                                    {profile?.gender || "Not added"}
                                </strong>
                            </div>

                            <div className="detail-card">
                                <span>Emergency Contact</span>
                                <strong>
                                    {profile?.emergencyContact || "Not added"}
                                </strong>
                            </div>

                            <div className="detail-card address-card">
                                <span>Address</span>
                                <strong>
                                    {profile?.address || "Not added"}
                                </strong>
                            </div>
                        </div>
                    ) : (
                        <form
                            className="profile-form"
                            onSubmit={handleSave}
                        >
                            <div className="form-group">
                                <label htmlFor="bloodGroup">
                                    Blood Group
                                </label>

                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select blood group
                                    </option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfBirth">
                                    Date of Birth
                                </label>

                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergencyContact">
                                    Emergency Contact
                                </label>

                                <input
                                    id="emergencyContact"
                                    type="tel"
                                    name="emergencyContact"
                                    placeholder="Emergency contact number"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="address">
                                    Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <button
                                type="submit"
                                className="save-profile-button"
                            >
                                Save Profile
                            </button>
                        </form>
                    )}

                    {saveMessage && (
                        <p className="success-message">
                            {saveMessage}
                        </p>
                    )}

                    {saveError && (
                        <p className="error-message">
                            {saveError}
                        </p>
                    )}
                </div>

                {/* Health Records */}
                <h2 className="modules-title">
                    My Health Records
                </h2>

                <div className="health-grid">
                    {/* Medical Reports */}
                    <div className="health-card">
                        <h2>📄 Medical Reports</h2>

                        <p>
                            Upload and manage medical reports in PDF,
                            JPG, or JPEG format. Keep your lab reports
                            and scan reports together in one place.
                        </p>

                        <button onClick={openMedicalRecords}>
                            Manage Reports
                        </button>
                    </div>

                    {/* Prescriptions */}
                    <div className="health-card">
                        <h2>💊 Prescriptions</h2>

                        <p>
                            Store and manage your prescriptions.
                            Keep track of prescribed medicines and
                            access your prescription records whenever
                            you need them.
                        </p>

                        <button onClick={openPrescriptions}>
                            Manage Prescriptions
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;