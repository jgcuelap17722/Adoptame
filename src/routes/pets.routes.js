import { Router } from "express";
import { upload } from "../middlewares/cloudinary.js";
import favouritePet from "./favouritePet.routes.js";

import {
  getAllPets,
  getPetsById,
  getPetsByIdUser,
  getPetsFoundation,
  createPets,
  updatePets,
  deletePets,
} from "../controllers/petsController.js";
import { authMiddleware } from "../middlewares/session.js";

const router = Router();

router.use('/favourite', favouritePet)
router.get("/foundation", getPetsFoundation);

router.get("/", getAllPets);
router.get("/:petId", getPetsById);
router.get("/user/:userId", getPetsByIdUser);

router.post(
  "/",
  authMiddleware,
  upload.array("photos"),
  createPets
);
router.put("/:petId", authMiddleware, upload.array("photos"), updatePets);
router.delete("/:petId", authMiddleware, deletePets);

export default router;
