import { writable } from "svelte/store";

export const checks = writable({
    user: [],
    db: [],
    system: []
});

export const loadingChecks = writable({
    user: false,
    db: false,
    system: false
});

// adding check to a specifik section
export function addCheck(section, check) {
    checks.update(all => {
        const sectionArray = all[section] || [];
        const existingIndex = all[section].findIndex(c => c.title === check.title);

        let newSectionArray;
        if (existingIndex !== -1) {
            newSectionArray = [
                ...sectionArray.slice(0, existingIndex),
                check,
                ...sectionArray.slice(existingIndex + 1)
            ];

        } else  {
            newSectionArray = [...sectionArray, check];
        }

        return { ...all, [section]: newSectionArray };

    });
}

export function updateCheck(section, title, patch) {
    checks.update(all => {
        const sectionArray = all[section] || [];
        return {
            ...all,
            [section]: sectionArray.map(c =>
                c.title === title
                ? { ...c, ...patch } //No new id
                : c
            )
        }
    })
}

// Clear section
export function clearSection(section) {
    checks.update(all => {
        return { ...all, [section]: [] };
    });
}