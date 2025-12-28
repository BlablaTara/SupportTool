import { Router } from "express";
import db from "../db/db.js";
import { COUNT_CHECK_CONFIG } from "../db/db.js";
import { CHECK_CONFIG_ERRORS } from "../db/db.js";

const router = Router();

router.get("/users/count", async (req, res) => {
    const email = req.query.email;

    if (!email) {
            return res.status(400).json({
            status: "error",
            message: "Missing Email",
            detail: "Query parameter 'email' is required",
            data: []
        });
    }
    
    const results = [];

    for (const err of CHECK_CONFIG_ERRORS) {
        results.push({
            status: "error",
            title: err.title,
            message: "Duplicate check title in configuration",
            detail: `Used in both ${err.firstType} and ${err.secondType}. Fix your .env file.`,
            data: []
        });
    }
    if (CHECK_CONFIG_ERRORS.length > 0) {
        return res.json(results);
    }
    

    for (const config of COUNT_CHECK_CONFIG) {
        try {
            const result = await db.findCount(config, email);
            results.push(result);
        } catch (error) {
            results.push({
                status: "error",
                title: config.title,
                message: "Count check failed",
                detail: error.message,
                data: []
            });
        }
    }
    
    res.json(results);

});

export default router;