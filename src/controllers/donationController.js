import { Donations } from '../models/Donations.js';
import { getPaymentByIdService } from '../services/PaymentService.js';
import { autoMail } from '../helpers/sendEmails.js';

export const createDonation = async (req, res) => {
  try {
    const { data } = req.body;
    console.log("req.body: ", req.body);
    const payment = await getPaymentByIdService(data.id);
    console.log("payment: ", payment);
    if (payment) {
      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
      } = payment;

      console.log('metadata: ', metadata);
      console.log('status: ', status);
      console.log('status_detail: ', status_detail);
      console.log('fee_details: ', fee_details);
      console.log('transaction_details: ', transaction_details);

      const infoPayment = {
        idPaymentMercadoPago:  id.toString(),
        fromUserId: metadata.from_user.id,
        toUserId: metadata.to_user.id,
        status,
        status_detail,
        comision_amount: fee_details[0]?.amount ?? 0,
        acredit_amount: transaction_details.net_received_amount,
        total_amount: transaction_details.total_paid_amount,
      }

      switch (status) {
        case 'approved':
          const newApprovedDonation = await Donations.create(infoPayment);
          return res.status(201).json({ data: newApprovedDonation, message: "successfully donated" })
        case 'in_process':
          const newPendingDonation = await Donations.create(infoPayment);
          return res.status(201).json({ data: newPendingDonation, message: "pending donation" })
        case 'rejected':
          const newRejectedDonation = await Donations.create(infoPayment);
          return res.status(201).json({ data: newRejectedDonation, message: "donation rejected" })
        default:
          const newErrorDonation = await Donations.create(infoPayment);
          return res.status(201).json({ data: newErrorDonation, message: "error" })
      }
    }
    return res.status(400).json({ data: req.body });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export const getDonationsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const donations = await Donations.findAll({
      attributes: { exclude: ['idPaymentMercadoPago']},
      where: {
        toUserId: userId
      }
    })
    return res.status(200).json(donations);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export const getDonations = async (req, res) => {
  try {
    const donations = await Donations.findAll();
    return res.status(200).json(donations);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

