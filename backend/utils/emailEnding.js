import "dotenv/config";

export function emailEnding(inputEmail) {
    const ending = process.env.EMAIL_ENDING || "";

    if (!ending) {
        return inputEmail;
    }

    if (inputEmail.includes("@")) {
        return inputEmail;
    }

    return inputEmail + ending;
}