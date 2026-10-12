
import { useEffect, useState } from "react";
import API_URL from "../services/api";
const API_URL_PRESCRIPTIONS = `${API_URL}/api/prescriptions`;

const emptyForm = {
    title: "",
    doctorName: "",
    medicineName: "",
    dosage: "",
    frequency: "",
    prescribedDate: "",
    endDate: "",
    notes: ""
};

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const loadPrescriptions = async () => {
        try {
            setError("");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Unable to load prescriptions.");
            }

            const data = await response.json();
            setPrescriptions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const handleChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!formData.title.trim() || !formData.medicineName.trim()) {
            setError("Enter a prescription title and medicine name.");
            return;
        }

        if (
            formData.prescribedDate &&
            formData.endDate &&
            formData.endDate < formData.prescribedDate
        ) {
            setError("The end date cannot be before the prescribed date.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    title: formData.title.trim(),
                    medicineName: formData.medicineName.trim()
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Unable to save prescription.");
            }

            setFormData(emptyForm);
            setMessage("Prescription saved successfully.");
            await loadPrescriptions();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this prescription permanently?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Unable to delete prescription.");
            }

            setPrescriptions((previous) =>
                previous.filter((item) => item.id !== id)
            );

            setMessage("Prescription deleted successfully.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="medical-records-page">
            <nav className="dashboard-navbar">
                <div className="logo">Digital Health Passport</div>

                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    Dashboard
                </button>
            </nav>

            <main className="medical-records-content">
                <h1>Prescriptions</h1>

                <p>
                    Keep your prescribed medicines and instructions
                    organized in one place.
                </p>

                <section className="record-form-section">
                    <h2>Add a Prescription</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Prescription Title *</label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Fever treatment"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="medicineName">Medicine Name *</label>
                            <input
                                id="medicineName"
                                name="medicineName"
                                value={formData.medicineName}
                                onChange={handleChange}
                                placeholder="Medicine name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="doctorName">Doctor Name</label>
                            <input
                                id="doctorName"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                placeholder="Prescribing doctor"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dosage">Dosage</label>
                            <input
                                id="dosage"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                placeholder="e.g. 500 mg"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="frequency">Frequency</label>
                            <input
                                id="frequency"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                placeholder="e.g. As prescribed"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prescribedDate">Prescribed Date</label>
                            <input
                                id="prescribedDate"
                                type="date"
                                name="prescribedDate"
                                value={formData.prescribedDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                id="endDate"
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional notes"
                                rows="3"
                            />
                        </div>

                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Prescription"}
                        </button>
                    </form>
                </section>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <section className="records-list-section">
                    <h2>Your Prescriptions</h2>

                    {loading ? (
                        <p>Loading prescriptions...</p>
                    ) : prescriptions.length === 0 ? (
                        <p>No prescriptions added yet.</p>
                    ) : (
                        <div className="records-list">
                            {prescriptions.map((item) => (
                                <article className="record-card" key={item.id}>
                                    <h3>💊 {item.title}</h3>

                                    <p>
                                        <strong>Medicine:</strong>{" "}
                                        {item.medicineName}
                                    </p>

                                    {item.doctorName && (
                                        <p>
                                            <strong>Doctor:</strong>{" "}
                                            {item.doctorName}
                                        </p>
                                    )}

                                    {item.dosage && (
                                        <p>
                                            <strong>Dosage:</strong> {item.dosage}
                                        </p>
                                    )}

                                    {item.frequency && (
                                        <p>
                                            <strong>Frequency:</strong>{" "}
                                            {item.frequency}
                                        </p>
                                    )}

                                    {item.prescribedDate && (
                                        <p>
                                            <strong>Prescribed:</strong>{" "}
                                            {item.prescribedDate}
                                        </p>
                                    )}

                                    {item.endDate && (
                                        <p>
                                            <strong>End date:</strong>{" "}
                                            {item.endDate}
                                        </p>
                                    )}

                                    {item.notes && (
                                        <p>
                                            <strong>Notes:</strong> {item.notes}
                                        </p>
                                    )}

                                    <div className="record-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Prescriptions;
