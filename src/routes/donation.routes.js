import { Router } from "express";
import { getDonations, createDonation, getDonationsById } from "../controllers/donationController.js";
import {
  createPreferentialPayment,
  getPaymentById,
  getAllPayments
} from "../controllers/mercadoPagoController.js";

const router = Router();

router.post("/urlPreferential", createPreferentialPayment);

router.get("/mercadopago", getAllPayments);
router.get("/mercadopago/:idPayment", getPaymentById);

router.post("/", createDonation);
router.get("/", getDonations);
router.get("/:userId", getDonationsById);

export default router;
