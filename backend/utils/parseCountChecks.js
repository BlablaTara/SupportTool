export function parseCountChecks(countEnvString) {
    if (!countEnvString) return [];

    return countEnvString.split(",").filter(Boolean).map(entry => {
        const [title, collectionField] = entry.split(":");
        const [collection, field] = collectionField.split(".");

        return {
            title: title?.trim() || "Count Check",
            collection: collection?.trim(),
            field: field?.trim()
        };
    });
}