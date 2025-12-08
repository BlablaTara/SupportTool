import { Router } from "express";
import db from "../db/db.js";
import { DROPDOWN_CHECK_CONFIG } from "../db/db.js";

const router = Router();

router.get("/users/dropdown", async (req, res) => {
    try {
    
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

            for (const config of DROPDOWN_CHECK_CONFIG) {
                try {
                    const result = await db.checkDropdown(config, email);
                    results.push(result);

                } catch (error) {
                    results.push({
                        status: "error",
                        title: config.title,
                        message: "Dropdown Check failed",
                        detail: error.message,
                        data: []
                    });
                }
            }   
        res.json(results);
    } catch (error) {

        return res.status(500).json({
            status: "error",
            title: "Dropdown Check",
            message: "Dropdown check failed",
            detail: error.message,
            data: []
        });

    }

});

export default router;