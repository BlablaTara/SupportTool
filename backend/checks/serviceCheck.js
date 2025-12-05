import { parseServices } from "../utils/parseServices.js";


// console.log("SERVICE_CHECKS raw:", process.env.SERVICE_CHECKS);
// console.log("Parsed services:", parseServices(process.env.SERVICE_CHECKS));

export async function serviceCheck(config) {
    const services = parseServices(process.env.SERVICE_CHECKS);

    if (services.length === 0) {
        return {
            status: "error",
            message: "No services configured in backend (SERVICE_CHECKS)",
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
                row[label] = "error";
                row.errors.push(`${label} error: URL missing`);
                return;
            }

            const protocols = ["http", "https"];
            let lastError = null;

            for (const protocol of protocols) {
                try {
                    const res = await fetch(`${protocol}://${url}/version`);

                    if (res.ok) {
                        const json = await res.json();
                        row[label] = json.version;
                        return;
                    } else {
                        lastError = `HTTP ${res.status}`;
                    }

                } catch (error) {
                    lastError = error.message;
                }
            }

            row[label] = "down";
            row.errors.push(`${label} fail: ${lastError}`);
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
        data: results
    };

}