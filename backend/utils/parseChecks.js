export function parseChecks(envString) {
    if (!envString) return [];

    return envString.split(",").filter(Boolean).map(entry => {
        const [title, collectionField] = entry.split(":");
        const [collection, field] = collectionField.split(".");

        return {
            title: title?.trim(),
            collection: collection?.trim(),
            field: field?.trim()
        };
    });
}