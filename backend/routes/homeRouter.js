import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("backend running")

});

export default router;