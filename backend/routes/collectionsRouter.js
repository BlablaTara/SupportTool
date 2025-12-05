import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.get("/collections/check", async (req, res) => {
    try {
        const result = await db.checkCollections();
        return res.json(result);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            title: "Collections Check",
            message: "Collections check failed",
            detail: error.message,
            data: []
        });
    }
});

export default router;