import axios from "axios";

const API = axios.create({
    baseURL: "https://civiclens-ai-iota.vercel.app/api"
});

export async function submitReport(image, latitude, longitude) {
    const formData = new FormData();

    formData.append("file", image);

    if (latitude !== null && latitude !== undefined && latitude !== "") {
        formData.append("lat", latitude);
    }
    if (longitude !== null && longitude !== undefined && longitude !== "") {
        formData.append("lng", longitude);
    }

    // THE FIX: We removed the manual headers. 
    // The browser will automatically set the correct multipart boundary now!
    const response = await API.post("/api/reports", formData);

    return response.data;
}

export async function getReports() {
    const response = await API.get("/api/reports");
    return response.data;
}

export const updateReportStatus = async (id, status) => {
    const formData = new FormData();
    formData.append("status", status);
  
    const response = await fetch(`http://127.0.0.1:8000/api/reports/${id}/status`, {
        method: "PATCH",
        body: formData,
    });
    
    if (!response.ok) throw new Error("Failed to update status");
    return await response.json();
};

export const deleteReport = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/reports/${id}`, {
        method: "DELETE",
    });
    
    if (!response.ok) throw new Error("Failed to delete report");
    return await response.json();
};

export default API;