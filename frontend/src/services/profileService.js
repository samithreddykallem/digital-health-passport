const API_URL = "http://localhost:8080/api/profile";

export const getProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load profile");
    }

    return response.json();
};