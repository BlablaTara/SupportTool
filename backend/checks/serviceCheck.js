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
                row[label] = "No URL";
                row.errors.push(`${label} error: URL missing`);
                return;
            }

            const protocols = ["http", "https"];
            let success = false;

            for (const protocol of protocols) {
                try {

                    const res = await fetch(`${protocol}://${url}/version`);

                    if (res.ok) {
                        const json = await res.json();
                        row[label] = json.version ?? "Unknown";
                        success = true;
                        break;
                    } else {
                        row[label] = `HTTP ${res.status}`;
                        row.errors.push(`${label} failed: HTTP ${res.status}`); 
                    }
                
                } catch (error) {
                    row[label] = "Down";
                    row.errors.push(`${label} fail: ${error.message}`);
                }

            }

            if (!success && !row.errors.find(e => e.startsWith(label))) {
                row[label] = "Down";
                row.errors.push(`${label} fail: Could not reach service`);
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
        data: results
    };

}