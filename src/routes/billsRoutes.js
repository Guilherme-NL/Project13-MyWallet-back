import { getBills, postBills } from "../controllers/billsController.js";
import { Router } from "express";
import tokenValidate from "../middlewares/tokenValidate.js";

const router = Router();

//routes
router.get("/bills", tokenValidate, getBills);

router.post("/bills", tokenValidate, postBills);

export default router;
