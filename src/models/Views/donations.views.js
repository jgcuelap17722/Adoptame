import { Donations } from '../../models/Donations.js';

export const findDonationById = async (donationId) => {
  const donation = Donations.findOne({
    attributes: { exclude: ['idPaymentMercadoPago'] },
    where: {
      idPaymentMercadoPago: donationId
    }
  })

  let nameStatus = {
    approved: "aprobado",
    in_process: "pendiente",
    rejected: "rechazado"
  }

  return {
    ...donation,
    status : nameStatus[donation.status],
  }
}

export const findAllDonations = async () => {

}

