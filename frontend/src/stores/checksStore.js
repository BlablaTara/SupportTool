import { writable } from "svelte/store";

export const checks = writable({
    user: [],
    db: [],
    btp: []
});

// adding check to a specifik section
export function addCheck(section, check) {
    checks.update(all => {
        all[section].push(check);
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