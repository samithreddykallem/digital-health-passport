const API_URL = "http://localhost:8080/api/users";

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
    }

    return response.json();
};