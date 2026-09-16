import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});


export async function submitReport(
    image,
    latitude,
    longitude
) {

    const formData = new FormData();

    formData.append(
        "image",
        image
    );

    if (latitude !== null) {
        formData.append(
            "latitude",
            latitude
        );
    }

    if (longitude !== null) {
        formData.append(
            "longitude",
            longitude
        );
    }

    const response =
        await API.post(
            "/api/reports",
            formData
        );

    return response.data;
}


export async function getReports() {

    const response =
        await API.get(
            "/api/reports"
        );

    return response.data;
}


export default API;