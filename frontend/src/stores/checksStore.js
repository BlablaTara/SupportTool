import { writable } from "svelte/store";

export const checks = writable({
    user: [],
    db: [],
    system: []
});

// adding check to a specifik section
export function addCheck(section, check) {
    checks.update(all => {
        const existingIndex = all[section].findIndex(c => c.title === check.title);

        // if checks with this title exists -> replace it
        if (existingIndex !== -1) {
            all[section] [existingIndex] = check;
        } else {
            // else add new
            all[section].push(check);
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