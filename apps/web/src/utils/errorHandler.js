import axios from "axios";

const errorHandler = (error) => {
    let message = "Something went wrong";
    let status = null;

    if (axios.isAxiosError(error)) {
        status = error.response?.status ?? null;

        if (!error.response) {
            message = "Network error. Please check your internet connection.";
            console.error("Network error:", error.message);
        } else if (status >= 500) {
            message = "Server error. Please try again later.";
            console.error("Server error:", error.response.data);
        } else {
            message =
                error.response.data?.error ||
                error.response.data?.message ||
                "Request failed";

            console.warn("Client error:", {
                status,
                message,
            });

            if (status === 401) {
                console.warn("Unauthorized");
            }
        }
    } else if (error instanceof Error) {
        message = error.message;
        console.error("JavaScript error:", error);
    } else {
        message = String(error);
        console.error("Unknown error:", error);
    }

    return message;
};

export default errorHandler;
