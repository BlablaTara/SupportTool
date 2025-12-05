export function parseCollectionsCheck(collectionString) {
    if (!collectionString) return [];

    return collectionString
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
}