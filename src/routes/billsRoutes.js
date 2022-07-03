import { getBills, postBills } from "../controllers/billsController.js";
import { Router } from "express";

const router = Router();

//routes
router.get("/bills", getBills);

router.post("/bills", postBills);

export default router;
