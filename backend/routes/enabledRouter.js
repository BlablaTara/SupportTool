import { Router } from "express";
import { isCheckEnabled } from "../middleware/requireCheckEnabled.js";

const router = Router();

router.get("/config/checks", (req, res) => {
    res.json({
        roles: isCheckEnabled("ROLES_CHECK_ENABLED"),
        count: isCheckEnabled("COUNT_CHECK_ENABLED"),
        dropdown: isCheckEnabled("DROPDOWN_CHECK_ENABLED"),
        collections: isCheckEnabled("COLLECTIONS_CHECK_ENABLED"),
        metrics: isCheckEnabled("METRICS_CHECK_ENABLED"),
        ping: isCheckEnabled("PING_CHECK_ENABLED"),
        service: isCheckEnabled("SERVICE_CHECK_ENABLED")

    });
});

export default router;