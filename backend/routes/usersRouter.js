import { Router }from 'express';
import db from "../db/db.js";

const router = Router();

router.get("/users/email", async (req, res) => {
    const collection = req.query.collection || process.env.EMAIL_COLLECTION;
    const email = req.query.email;

    if(!email) {
        return res.status(400).json({ ok: false, error: "MISSING EMAIL" });
    }

    const result = await db.findEmail(collection, email);


    if (!result.ok) {
        return res.status(400).json(result);
    }

    return res.json({
        ok: true,
        collection,
        items: result.items
    });
});

router.get("/users/email-ending", (req, res) => {
    res.json({
        ok: true,
        ending: process.env.EMAIL_ENDING || ""
    });
});

export default router;