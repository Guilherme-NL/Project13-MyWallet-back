import {
  postRegistration,
  postLogin,
  postLogout,
} from "../controllers/authController.js";
import { Router } from "express";
import tokenValidate from "../middlewares/tokenValidate.js";

const router = Router();

//routes
router.post("/registration", postRegistration);

router.post("/login", postLogin);

router.post("/sessions", tokenValidate, postLogout);

export default router;
