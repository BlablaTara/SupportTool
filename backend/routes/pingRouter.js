import { Router } from "express";
import { pingCheckM } from "../checks/mongo/pingCheckM.js";

const router = Router();

router.get("/ping", async (req, res) => {

    const result = await pingCheckM();

    if (result.status === "error") {
        return res.status(500).json(result);
    }

    // if (result.status === "fail") {
    //     return res.status(404).json(result);
    // }

    return res.json(result);
});

export default router;