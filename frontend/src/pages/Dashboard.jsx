import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import API_URL from "../services/api";

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
        } catch (err) {
            console.error("Profile loading error:", err);
            setError(err.message || "Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaveMessage("");
        setSaveError("");
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.message || "Failed to update profile.");
            }
            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setSaveMessage("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            console.error("Profile update error:", err);
            setSaveError(err.message || "Unable to update your profile.");
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

    const cancelEditing = () => {
        setFormData({
            bloodGroup: profile?.bloodGroup || "",
            dateOfBirth: profile?.dateOfBirth || "",
            gender: profile?.gender || "",
            address: profile?.address || "",
            emergencyContact: profile?.emergencyContact || ""
        });
        setEditing(false);
        setSaveMessage("");
        setSaveError("");
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loading-spinner" aria-hidden="true" />
                <h2>Preparing your health passport...</h2>
                <p>Securely loading your profile</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="loading-page">
                <div className="error-state-icon" aria-hidden="true">!</div>
                <h2>Unable to load your profile</h2>
                <p>{error}</p>
                <button onClick={handleLogout}>Back to Login</button>
            </div>
        );
    }

    const userName = profile?.user?.name || "there";
    const initials = (profile?.user?.name || "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    return (
        <div className="dashboard">
            <nav className="dashboard-navbar">
                <a className="brand-lockup" href="/" aria-label="Digital Health Passport home">
                    <span className="brand-mark" aria-hidden="true">✚</span>
                    <span className="logo">Digital Health <span>Passport</span></span>
                </a>
                <div className="navbar-right">
                    <span className="secure-indicator"><span /> Your health space</span>
                    <div className="navbar-user">
                        <span className="avatar">{initials}</span>
                        <span className="navbar-user-name">{profile?.user?.name || "User"}</span>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        <span aria-hidden="true">↗</span> Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <section className="welcome-row">
                    <div>
                        <p className="eyebrow">YOUR PERSONAL HEALTH SPACE</p>
                        <h1>Welcome back, {userName} <span className="wave" aria-hidden="true">✦</span></h1>
                        <p className="dashboard-subtitle">
                            Your health information, organized and accessible in one secure place.
                        </p>
                    </div>
                    <div className="welcome-date">
                        <span className="welcome-date-icon" aria-hidden="true">✚</span>
                        <span><strong>Digital Health Passport</strong><small>Your health. Your control.</small></span>
                    </div>
                </section>

                <section className="dashboard-hero">
                    <div className="hero-copy">
                        <span className="hero-kicker">A healthier way to stay organized</span>
                        <h2>Your health story,<br /><span>all in one place.</span></h2>
                        <p>Keep your medical reports and prescriptions together, ready when you need them.</p>
                        <button className="hero-button" onClick={openMedicalRecords}>
                            Explore medical reports <span aria-hidden="true">→</span>
                        </button>
                    </div>
                    <div className="hero-art" aria-hidden="true">
                        <div className="hero-orbit orbit-one" />
                        <div className="hero-orbit orbit-two" />
                        <div className="hero-shield">✚</div>
                        <div className="hero-document"><span /><span /><span /><b>✓</b></div>
                        <div className="hero-plus plus-one">+</div>
                        <div className="hero-plus plus-two">+</div>
                    </div>
                </section>

                <section className="profile-summary" aria-label="Personal information">
                    <div className="summary-card summary-name">
                        <span className="summary-icon" aria-hidden="true">♙</span>
                        <div><span className="summary-label">Full name</span><strong>{profile?.user?.name || "Not available"}</strong></div>
                    </div>
                    <div className="summary-card summary-email">
                        <span className="summary-icon" aria-hidden="true">✉</span>
                        <div><span className="summary-label">Email address</span><strong>{profile?.user?.email || "Not available"}</strong></div>
                    </div>
                    <div className="summary-card summary-phone">
                        <span className="summary-icon" aria-hidden="true">⌕</span>
                        <div><span className="summary-label">Phone number</span><strong>{profile?.user?.phone || "Not available"}</strong></div>
                    </div>
                </section>

                <section className="health-info">
                    <div className="section-header">
                        <div>
                            <p className="eyebrow">PERSONAL DETAILS</p>
                            <h2>Your health profile</h2>
                            <p className="section-description">Keep important health details up to date.</p>
                        </div>
                        {!editing ? (
                            <button className="edit-profile-button" onClick={() => {
                                setEditing(true);
                                setSaveMessage("");
                                setSaveError("");
                            }}>✎ <span>Edit profile</span></button>
                        ) : (
                            <button className="edit-profile-button secondary-button" onClick={cancelEditing}>Cancel</button>
                        )}
                    </div>

                    {!editing ? (
                        <div className="health-details">
                            <div className="detail-card blood-card">
                                <span className="detail-symbol" aria-hidden="true">+</span>
                                <span>Blood group</span>
                                <strong>{profile?.bloodGroup || "Not added"}</strong>
                            </div>
                            <div className="detail-card">
                                <span className="detail-symbol" aria-hidden="true">▦</span>
                                <span>Date of birth</span>
                                <strong>{profile?.dateOfBirth || "Not added"}</strong>
                            </div>
                            <div className="detail-card">
                                <span className="detail-symbol" aria-hidden="true">♙</span>
                                <span>Gender</span>
                                <strong>{profile?.gender || "Not added"}</strong>
                            </div>
                            <div className="detail-card">
                                <span className="detail-symbol emergency-symbol" aria-hidden="true">!</span>
                                <span>Emergency contact</span>
                                <strong>{profile?.emergencyContact || "Not added"}</strong>
                            </div>
                            <div className="detail-card address-card">
                                <span className="detail-symbol" aria-hidden="true">⌖</span>
                                <span>Address</span>
                                <strong>{profile?.address || "Not added"}</strong>
                            </div>
                        </div>
                    ) : (
                        <form className="profile-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label htmlFor="bloodGroup">Blood group</label>
                                <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                                    <option value="">Select blood group</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) =>
                                        <option key={group} value={group}>{group}</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of birth</label>
                                <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select gender</option>
                                    {["Male", "Female", "Other"].map((gender) =>
                                        <option key={gender} value={gender}>{gender}</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="emergencyContact">Emergency contact</label>
                                <input id="emergencyContact" type="tel" name="emergencyContact" placeholder="Emergency contact number" value={formData.emergencyContact} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="address">Address</label>
                                <textarea id="address" name="address" placeholder="Enter your address" value={formData.address} onChange={handleChange} rows="3" />
                            </div>
                            <button type="submit" className="save-profile-button">Save changes</button>
                        </form>
                    )}
                    {saveMessage && <p className="success-message" role="status">{saveMessage}</p>}
                    {saveError && <p className="error-message" role="alert">{saveError}</p>}
                </section>

                <section className="records-section">
                    <div className="records-section-heading">
                        <div>
                            <p className="eyebrow">YOUR RECORDS</p>
                            <h2>Health records</h2>
                            <p>Everything you save, organized in one place.</p>
                        </div>
                        <span className="records-count">2 services</span>
                    </div>
                    <div className="health-grid">
                        <article className="health-card medical-card">
                            <div className="health-card-top">
                                <span className="health-card-icon" aria-hidden="true">▤</span>
                                <span className="card-tag">DOCUMENTS</span>
                            </div>
                            <h3>Medical reports</h3>
                            <p>Upload and manage your lab reports, scans, and other medical files. Keep important results easy to find.</p>
                            <button onClick={openMedicalRecords}>Manage reports <span aria-hidden="true">→</span></button>
                        </article>
                        <article className="health-card prescriptions-card">
                            <div className="health-card-top">
                                <span className="health-card-icon" aria-hidden="true">✚</span>
                                <span className="card-tag">MEDICATION</span>
                            </div>
                            <h3>Prescriptions</h3>
                            <p>Store your prescription details and keep a convenient record of medicines prescribed to you.</p>
                            <button onClick={openPrescriptions}>Manage prescriptions <span aria-hidden="true">→</span></button>
                        </article>
                    </div>
                </section>

                <footer className="dashboard-footer">
                    <span><span className="footer-mark">✚</span> Digital Health Passport</span>
                    <span>Designed to keep your health information organized.</span>
                </footer>
            </main>
        </div>
    );
}

export default Dashboard;