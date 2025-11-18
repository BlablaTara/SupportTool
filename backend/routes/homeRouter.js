import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("backend running")

});


router.get("/check-user", (req, res) => {
    const email = req.query.email;

    const testUsers = [
        "test@test.dk",
        "bo@test.dk",
        "bente@test.dk"
    ];

    const exists = testUsers.includes(email);

    res.send({
        email,
        exists,
        collection: "test_users"
    });
})

export default router;