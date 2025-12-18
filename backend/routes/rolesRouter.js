import { Router } from "express";
import db from "../db/db.js";
import { requireCheckEnabled } from "../middleware/requireCheckEnabled.js";

const router = Router();

router.use(requireCheckEnabled("ROLES_CHECK_ENABLED"))

router.get("/users/roles", async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({
            status: "error",
            message: "Missing Email",
            detail: "Query parameter 'email' is required",
            data: []
        });
    }

    const result = await db.findRoles(email);

    if (result.status === "error") {
        return res.status(500).json(result);
    }

    return res.json(result);
});

export default router;