export function parseCountChecks(envString) {
    if (!envString) return {};

    const checks = {};

    envString.split(",").forEach(entry => {
        const  [id, collectionField, title] = entry.split(":");

        if (!id || !collectionField) return;

        const [collection, field] = collectionField.split(".");

        checks[id] = {
            id,
            collection,
            field,
            title: title || "Count Check"
        };
        
    });

    return checks;
}