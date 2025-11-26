import { connectMongo } from "./mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function rolesCheckM(collection, email) {
    const fullEmail = emailEnding(email);

    try {
        const db = await connectMongo();
        const user = await db.collection(collection).findOne({ email: fullEmail });

        if (!user) {
            return {
                status: "fail",
                message: `User not found: ${fullEmail}`,
                detail: collection,
                data: []
            };
        }

        if (user.roles === "") {
            return {
                status: "fail",
                message: `${fullEmail}, has 0 roles`,
                detail: collection,
                data: []
            }
        }

        return {
            status: "success",
            message: `${fullEmail}, has roles: ${user.roles?.join(", ")}`,
            detail: collection,
            data: user.roles
        };

    } catch (error) {
        return {
            status: "error",
            message: "MongoDB role-query failed",
            detail: error.message
        };
    }
    
}