
import API_URL from "./api";

export async function getProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to load profile: HTTP ${response.status}`);
    }

    return await response.json();
}
