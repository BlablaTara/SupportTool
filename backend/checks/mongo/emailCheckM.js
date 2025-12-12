import { connectMongo } from "../../db/mongoDriver.js";
import { emailEnding } from "../../utils/emailEnding.js";

export async function emailCheckM(email) {
  const fullEmail = emailEnding(email);
  const collection = process.env.EMAIL_COLLECTION;

  try {
    const db = await connectMongo();
    const data = await db
      .collection(collection)
      .find({ email: fullEmail })
      .toArray();

    return {
      status: data.length ? "success" : "fail",
      message: data.length
        ? `Email found: ${fullEmail}`
        : `Email not found: ${fullEmail}`,
      detail: `Collection: '${collection}'`,
      data,
    };
  } catch (error) {
    return {
      status: "error",
      message: "MongoDB query failed",
      detail: error.message,
    };
  }
}
