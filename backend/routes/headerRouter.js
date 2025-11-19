import { Router } from "express";

const router = Router();

router.get("/environment", (req, res) => {
    res.json({
        environment: process.env.ENVIRONMENT || "UNKNOWN"
    });
});

export default router;