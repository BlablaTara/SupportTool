
export async function pingCheck() {
    const pingURL = process.env.PING_URL

    try {
        const res = await fetch(pingURL, { method: "GET" });

        if (res.ok) {
            return {
                status: "success",
                message: "Ping success - is running",
                detail: pingURL,
                data: [],
            };

        }

        return {
            status: "fail",
            message: `Ping failed: - ${res.status}`,
            detail: pingURL,
            data: [],
        };

    } catch (error) {
        return {
            status: "error",
            message: "Couln't ping this domain - Check the URL for misspelling.",
            detail: error.message,
        };
    }
}