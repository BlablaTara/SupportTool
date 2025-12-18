export function isCheckEnabled(envKey) {
    return process.env[envKey] === "true";
}

export function requireCheckEnabled(envKey) {
    return (req, res, next) => {
        if (!isCheckEnabled(envKey)) {
            return res.status(204).end();
        }
        next();
    };
}