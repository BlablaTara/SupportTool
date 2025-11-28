import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function rolesCheckM(email) {
  const fullEmail = emailEnding(email);
  const collection = process.env.EMAIL_COLLECTION;
  const field = process.env.ROLES_FIELD;

  try {
    const db = await connectMongo();
    const user = await db.collection(collection).findOne({ email: fullEmail });

    if (!user) {
      return {
        status: "fail",
        message: `User not found: ${fullEmail}`,
        detail: collection,
        data: [],
      };
    }

    const roles = user[field];
    let rolesArray;

    if (Array.isArray(roles)) {
      rolesArray = roles;
    } else if (typeof roles === "string" && roles.trim() !== "") {
      rolesArray = [roles]; //from string to array
    } else {
      rolesArray = [];
    }

    if (rolesArray.length === 0) {
      return {
        status: "fail",
        message: `${fullEmail} has 0 roles`,
        detail: `Looking in - Collection: ' ${collection} '.  Field: ' ${field} '`,
        data: [],
      };
    }

    return {
      status: "success",
      message: `${fullEmail} has roles: ${rolesArray.join(", ")}`,
      detail: `Looking in - Collection: ' ${collection} '.  Field: ' ${field} '`,
      data: rolesArray,
    };
  } catch (error) {
    return {
      status: "error",
      message: "MongoDB role-query failed",
      detail: error.message,
    };
  }
}
