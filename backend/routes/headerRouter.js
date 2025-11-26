import { Router } from "express";

const router = Router();

router.get("/environment", (req, res) => {

    const env = process.env.ENVIRONMENT || "UNKNOWN"
    const colors = {
        DEV: "#28a745", 
        TEST: "#ebbd27ff", 
        PROD: "#d32f2f",
        UNKNOWN: "#757575"
    };
    res.json({
        environment: env,
        color: colors[env] || colors.UNKNOWN
    });

});

router.get("/database", (req, res) => {
    res.json({
        database: process.env.DB_TYPE || "UNKNOWN"
    });
});

export default router;