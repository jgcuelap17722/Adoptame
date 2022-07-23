import { Router } from "express";
import {
  findPetsByCity,
} from "../controllers/petsController.js";
const router = Router();

router.get("/", findPetsByCity);

export default router;
