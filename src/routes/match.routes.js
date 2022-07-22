import { Router } from "express";
import { DeleteMatch, matchPet, PutMachUser } from "../controllers/match.Controller.js";
import { authMiddleware } from "../middlewares/session.js";

const router = Router();

router.post('/:userId', authMiddleware, matchPet)
router.put('/matchUser/:id', authMiddleware, PutMachUser)
router.delete('/delete/:id', authMiddleware, DeleteMatch)

export default router;