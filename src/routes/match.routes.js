import { Router } from "express";
import { DeleteMatch, matchPet, PutMachUser } from "../controllers/match.Controller.js";



const router = Router();

router.post('/',matchPet)
router.put('/matchUser/:id',PutMachUser)
router.delete('/delete/:id',DeleteMatch)




export default router;