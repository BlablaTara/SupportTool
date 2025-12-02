import { Router } from "express";
import { serviceCheck } from "../checks/serviceCheck.js";

const router = Router();

router.get("/services", async (req, res) => {

    const result = await serviceCheck();

    if (result.status === "error") {
        return res.status(500).json(result);
    }

    // if (result.status === "fail") {
    //     return res.status(404).json(result);
    // }

    return res.json(result);
});

export default router;