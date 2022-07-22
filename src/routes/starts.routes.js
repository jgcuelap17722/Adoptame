import { Router } from "express";
import { prop, starts } from "../controllers/startController.js";
const router = Router();
router.post('/', prop)
router.get('/:id', starts)
export default router;