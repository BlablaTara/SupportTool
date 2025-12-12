import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.get("/metrics", async (req, res) => {
    try {
        const result = await db.checkMetrics();
        return res.json(result);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            title: "DB Metrics",
            message: "Metrics check failed",
            detail: error.message,
            data: {}
        });
    }
});

export default router;


