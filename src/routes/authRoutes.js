import { postRegistration, postLogin } from "../controllers/authController.js";
import { Router } from "express";

const router = Router();

//routes
router.post("/registration", postRegistration);

router.post("/login", postLogin);

export default router;
