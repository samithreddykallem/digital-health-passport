
import { useEffect, useState } from "react";
import API_URL from "../services/api";
const API_URL_RECORDS = `${API_URL}/api/medical-records`;

function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        diagnosis: "",
        doctorName: "",
        recordDate: "",
        notes: ""
    });

    const [file, setFile] = useState(null);

    const token = localStorage.getItem("token");

    const loadRecords = async () => {
        try {
            setError("");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to load medical reports.");
            }

            const data = await response.json();
            setRecords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        setError("");
        setMessage("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const allowedExtensions = /\.(pdf|jpe?g)$/i;

        if (!allowedExtensions.test(selectedFile.name)) {
            setError("Only PDF, JPG, and JPEG files are allowed.");
            event.target.value = "";
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("File size must not exceed 10 MB.");
            event.target.value = "";
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!formData.title.trim()) {
            setError("Please enter a report title.");
            return;
        }

        if (!file) {
            setError("Please select a PDF or JPEG report.");
            return;
        }

        const uploadData = new FormData();

        uploadData.append("title", formData.title.trim());
        uploadData.append("diagnosis", formData.diagnosis);
        uploadData.append("doctorName", formData.doctorName);
        uploadData.append("recordDate", formData.recordDate);
        uploadData.append("notes", formData.notes);
        uploadData.append("file", file);

        try {
            setUploading(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: uploadData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    errorText || "Unable to upload medical report."
                );
            }

            setMessage("Medical report uploaded successfully!");

            setFormData({
                title: "",
                diagnosis: "",
                doctorName: "",
                recordDate: "",
                notes: ""
            });

            setFile(null);

            event.target.reset();

            await loadRecords();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const openFile = async (record, download = false) => {
        try {
            setError("");

            const action = download ? "download" : "file";

            const response = await fetch(
                `${API_URL}/${record.id}/${action}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to access this medical report.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (download) {
                const link = document.createElement("a");
                link.href = url;
                link.download = record.fileName || record.title;
                document.body.appendChild(link);
                link.click();
                link.remove();

                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } else {
                const newWindow = window.open("", "_blank");

                if (!newWindow) {
                    URL.revokeObjectURL(url);
                    throw new Error(
                        "Pop-up blocked. Allow pop-ups to view reports."
                    );
                }

                newWindow.location.href = url;

                setTimeout(() => URL.revokeObjectURL(url), 60000);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteRecord = async (id) => {
        if (!window.confirm("Delete this medical report permanently?")) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Unable to delete medical report.");
            }

            setRecords((previous) =>
                previous.filter((record) => record.id !== id)
            );

            setMessage("Medical report deleted successfully.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="medical-records-page">
            <nav className="dashboard-navbar">
                <div className="logo">Digital Health Passport</div>

                <button onClick={() => window.location.href = "/"}>
                    Dashboard
                </button>
            </nav>

            <main className="medical-records-content">
                <h1>Medical Reports</h1>

                <p>
                    Upload and manage your medical reports securely.
                    Files are stored in your MySQL database.
                </p>

                <section className="record-form-section">
                    <h2>Upload a Medical Report</h2>

                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label htmlFor="title">Report Title *</label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Blood Test Report"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="diagnosis">Diagnosis</label>
                            <input
                                id="diagnosis"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                placeholder="Diagnosis (optional)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="doctorName">Doctor Name</label>
                            <input
                                id="doctorName"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                placeholder="Doctor name (optional)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="recordDate">Report Date</label>
                            <input
                                id="recordDate"
                                type="date"
                                name="recordDate"
                                value={formData.recordDate}
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

                        <div className="form-group">
                            <label htmlFor="reportFile">
                                Select Report (PDF, JPG, JPEG; max 10 MB) *
                            </label>

                            <input
                                id="reportFile"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                                onChange={handleFileChange}
                                required
                            />

                            {file && (
                                <p>
                                    Selected: {file.name} (
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        <button type="submit" disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload Report"}
                        </button>
                    </form>
                </section>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <section className="records-list-section">
                    <h2>Your Medical Reports</h2>

                    {loading ? (
                        <p>Loading reports...</p>
                    ) : records.length === 0 ? (
                        <p>No Medical Records</p>
                    ) : (
                        <div className="records-list">
                            {records.map((record) => (
                                <article
                                    className="record-card"
                                    key={record.id}
                                >
                                    <h3>{record.title}</h3>

                                    <p>
                                        <strong>File:</strong>{" "}
                                        {record.fileName || "Not available"}
                                    </p>

                                    {record.diagnosis && (
                                        <p>
                                            <strong>Diagnosis:</strong>{" "}
                                            {record.diagnosis}
                                        </p>
                                    )}

                                    {record.doctorName && (
                                        <p>
                                            <strong>Doctor:</strong>{" "}
                                            {record.doctorName}
                                        </p>
                                    )}

                                    {record.recordDate && (
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {record.recordDate}
                                        </p>
                                    )}

                                    {record.notes && (
                                        <p>
                                            <strong>Notes:</strong>{" "}
                                            {record.notes}
                                        </p>
                                    )}

                                    <div className="record-actions">
                                        <button
                                            type="button"
                                            onClick={() => openFile(record)}
                                        >
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openFile(record, true)}
                                        >
                                            Download
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteRecord(record.id)}
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

export default MedicalRecords;
