import { Router } from "express";
import db from "../db/db.js";
import { COUNT_CHECK_CONFIG } from "../db/db.js";

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

    // const result = await db.findCount(email);

    // if (result.status === "error") {
    //     return res.status(500).json(result);
    // }

    // if (result.status === "fail") {
    //     return res.status(404).json(result);
    // }

    //const result = await db.findCount(email);
    
    const results = [];

    for (const id in COUNT_CHECK_CONFIG) {
        try {
            const checkResult = await db.findCount(id, email);
            results.push(checkResult);
        } catch (error) {
            results.push({
                status: "error",
                title: COUNT_CHECK_CONFIG[id].title,
                message: "Count check failed",
                detail: error.message,
                data: []
            });
        }
    }
    
    
    res.json(results);

    //return res.json(result);
});

export default router;