import { Router } from "express";

const router = Router();

router.get("/environment", (req, res) => {
    res.json({
        environment: process.env.ENVIRONMENT || "UNKNOWN"
    });
});

router.get("/database", (req, res) => {
    res.json({
        database: process.env.DB_TYPE || "UNKNOWN"
    });
});

export default router;