import { parseServices } from "../utils/parseServices.js";


console.log("SERVICE_CHECKS raw:", process.env.SERVICE_CHECKS);
console.log("Parsed services:", parseServices(process.env.SERVICE_CHECKS));

export async function serviceCheck(config) {
    //const { name, devURL, testURL, prodURL } = parseServices(process.env.SERVICE_CHECKS);
    const services = parseServices(process.env.SERVICE_CHECKS);

    if (services.length === 0) {
        return {
            status: "error",
            message: "No services configured in backend (SERVICE_CHECKS)",
            detail: null,
            data: []
        };
    }

    const results = [];

    for (const service of services) {
        const row = {
            service: service.name,
            dev: null,
            test: null,
            prod: null,
            errors: []
        };
    

        // Helper that checks every environment for a service
        async function checkServiceVersionEnv(label, url) {
            if (!url) {
                row[label] = "No URL";
                return;
            }

            try {
                // Hvad hvis det er en https???
                const res = await fetch(`http://${url}/version`);

                if (!res.ok) {
                    row[label] = `HTTP ${res.status}`;
                    row.errors.push(`${label} failed: HTTP ${res.status}`);
                    return;
                }

                const json = await res.json();

                row[label] = json.version ?? "Unknown";

            } catch (error) {
                row[label] = "Down";
                row.errors.push(`${label} error: ${error.message}`);
            }

        }

        await checkServiceVersionEnv("dev", service.devURL);
        await checkServiceVersionEnv("test", service.testURL);
        await checkServiceVersionEnv("prod", service.prodURL);

        results.push(row);
    }

    const hasFailures = results.some(row => row.errors.length > 0);

    return {
        status: hasFailures ? "fail" :  "success",
        message: `${results.length} service(s) checked`,
        detail: hasFailures
            ? "One or more services could not be reached."
            : "All services reachable.",
        data: results
    };

}