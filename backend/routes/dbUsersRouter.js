import { Router }from 'express';
import db from "../db/db.js";

const router = Router();

router.get("/users", async (req, res) => {
    const collection = req.query.collection || process.env.EMAIL_COLLECTION;
    const email = req.query.email;

    try {
            let items;
        if (email) {
            items = await db.findFiltered(collection, { email });
        } else {
            items = await db.findAll(collection);
        }
        res.json({
            collection,
            items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});

export default router;