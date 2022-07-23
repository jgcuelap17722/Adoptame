import { Router } from "express";
import {
  findPetsByCountry,
} from "../controllers/petsController.js";
const router = Router();

router.get("/", findPetsByCountry);

export default router;
