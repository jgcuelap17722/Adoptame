import { Router } from "express";
import { matchPet, PutMachUser } from "../controllers/match.Controller.js";



const router = Router();

router.post('/',matchPet)
router.put('/matchUser/:id',PutMachUser)




export default router;