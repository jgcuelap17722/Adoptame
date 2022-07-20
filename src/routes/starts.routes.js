import { Router } from "express";
import { prop, starts } from "../controllers/startController.js";
const router = Router();
router.post('/:id', prop)
router.get('/:id', starts)
export default router;