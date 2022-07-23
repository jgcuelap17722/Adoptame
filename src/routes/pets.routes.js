import { Router } from "express";
import { upload } from "../middlewares/cloudinary.js";
import { authMiddleware } from "../middlewares/session.js";
import favouritePet from "./favouritePet.routes.js";
import petsDataFake from "./petsDataFake.routes.js";
import cityPet from "./cityPet.routes.js";
import countryPet from "./countryPet.routes.js";

import {
  getAllPets,
  getPetsById,
  getPetsByIdUser,
  getPetsFoundation,
  createPets,
  updatePets,
  deletePets,
} from "../controllers/petsController.js";

const router = Router();

router.use('/favourite', favouritePet)
router.use('/addPets', petsDataFake);
router.use("/city", cityPet);
router.use("/country", countryPet);

router.get("/", getAllPets);
router.get("/:petId", getPetsById);
router.get("/foundation", getPetsFoundation);
router.get("/user/:userId", getPetsByIdUser);

router.post("/", authMiddleware, upload.array("photos"), createPets);
router.put("/:petId", authMiddleware, upload.array("photos"), updatePets);
router.delete("/:petId", authMiddleware, deletePets);

export default router;
