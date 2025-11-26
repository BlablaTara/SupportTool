import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.get("/users/roles", async (req, res) => {
    const collection = req.query.collection || process.env.ROLES_COLLECTION;
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({
            status: "error",
            message: "Missing Email",
            detail: "Query parameter 'email' is required",
            data: []
        });
    }

    const result = await db.findRoles(collection, email);

    if (result.status === "error") {
        return res.status(500).json(result);
    }

    if (result.status === "fail") {
        return res.status(404).json(result);
    }

    return res.json(result);
});

export default router;