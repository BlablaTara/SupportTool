export function parseServices(serviceEnvString) {
    if (!serviceEnvString) return [];

    return serviceEnvString.split(";").filter(Boolean).map(entry => {
        const [name, devURL, testURL, prodURL] = entry.split(",");

        return {
            name: name?.trim(),
            devURL: devURL?.trim(),
            testURL: testURL?.trim(),
            prodURL: prodURL?.trim()

        };
    });
}