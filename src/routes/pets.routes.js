import { Router } from "express";
import { upload } from "../middlewares/cloudinary.js";
import favouritePet from "./favouritePet.routes.js";
import { authMiddleware } from "../middlewares/session.js";
import petsDataFake from "./petsDataFake.routes.js";

import {
  getAllPets,
  getPetsById,
  getPetsByIdUser,
  getPetsFoundation,
  createPets,
  updatePets,
  deletePets,
  findPetsByCity,
  findPetsByCountry,
} from "../controllers/petsController.js";

const router = Router();

router.use('/favourite', favouritePet)
router.use('/addPets', petsDataFake);

router.get("/", getAllPets);
router.get("/city", findPetsByCity);
router.get("/country", findPetsByCountry);
router.get("/:petId", getPetsById);
router.get("/foundation", getPetsFoundation);
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
