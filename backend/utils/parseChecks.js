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

export function findDuplicateCheckTitles(...checkGroups) {
    const seen = new Map();
    const duplicates = [];

    for (const group of checkGroups) {
        for (const check of group) {
            const title = check.title;
            if (!title) continue;

            if (seen.has(title)) {
                duplicates.push({
                    title,
                    firstType: seen.get(title),
                    secondType: check.type,
                });
            } else {
                seen.set(title, check.type);
            }
        }
    }

    return duplicates;
}

