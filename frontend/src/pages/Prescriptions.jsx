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

            const response = await fetch(API_URL_PRESCRIPTIONS, {
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

            const response = await fetch(API_URL_PRESCRIPTIONS, {
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