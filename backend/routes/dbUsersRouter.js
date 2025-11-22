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




    // try {
    //     let items;
    //     if (email) {
    //         items = await db.findFiltered(collection, { email });
    //     } else {
    //         items = await db.findAll(collection);
    //     }
    //     res.json({
    //         collection,
    //         items
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Server error" });
    // }

});

export default router;