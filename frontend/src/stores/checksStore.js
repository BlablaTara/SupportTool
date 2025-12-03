import { writable } from "svelte/store";

export const checks = writable({
    user: [],
    db: [],
    system: []
});

// adding check to a specifik section
export function addCheck(section, check) {
    checks.update(all => {

        if (check.title === "Service Check") {
            all[section] = [...all[section], check];
            return all;
        }

        const existingIndex = all[section].findIndex(c => c.title === check.title);

        if (existingIndex !== -1) {
            all[section] = [
                ...all[section].slice(0, existingIndex),
                check,
                ...all[section].slice(existingIndex+1)
            ];
        } else {
            all[section] = [...all[section], check];
        }

        return all;
    });
}

// Clear section
export function clearSection(section) {
    checks.update(all => {
        all[section] = [];
        return all;
    });
}