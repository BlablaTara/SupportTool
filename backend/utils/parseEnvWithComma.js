export function parseEnvWithComma(envString) {
    if (!envString) return [];

    return envString
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
}