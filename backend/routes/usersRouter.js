import { Router }from 'express';
import db from "../db/db.js";

const router = Router();

router.get("/users/email", async (req, res) => {
    const email = req.query.email;

    if(!email) {
        return res.status(400).json({ 
            status: "error", 
            message: "Missing Email",
            detail: "Query parameter 'email' is required",
            data: []
        });
    }

    const result = await db.findEmail(email);


    if (result.status === "error") {
        return res.status(500).json(result);
    }

    return res.json(result);
});

router.get("/users/email-ending", (req, res) => {
    return res.json({
        status: "success",
        message: "Email ending retrieved",
        detail: null,
        ending: process.env.EMAIL_ENDING || ""
    });
});

export default router;