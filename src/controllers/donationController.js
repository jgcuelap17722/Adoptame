import { Donations } from '../models/Donations.js';
import { getPaymentByIdService, getPaymentsService } from '../services/PaymentService.js';
import { autoEmail } from '../helpers/sendEmails.js';
import { findDonationById } from '../models/Views/donations.views.js';

export const createDonation = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    const { data } = req.body;
    const payment = await getPaymentByIdService(data.id);
    if (payment) {
      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
        currency_id,
      } = payment;

      const { from_user, to_user, } = metadata;

      const infoPayment = {
        idPaymentMercadoPago: id.toString(),
        fromUserId: from_user.id,
        toUserId: to_user.id,
        status,
        status_detail,
        comision_amount: fee_details[0]?.amount ?? 0,
        acredit_amount: transaction_details.net_received_amount,
        total_amount: transaction_details.total_paid_amount,
        currency: currency_id
      }

      let mailDetail = {
        header: `Adoptame`,
        toMail: to_user.email,
        subject: `${from_user.name} te ha donado ${infoPayment.acredit_amount} ${currency_id}`,
        titulo: `${from_user.name} te ha donado ${infoPayment.acredit_amount} ${currency_id} `,
        mensaje: `Para la fundación: ${to_user.name}`,
      }

      const newDonation = {
        approved: (infoDonation) => {
          autoEmail(mailDetail)
          return res.status(201).json({ data: infoDonation, message: "successfully donated" })
        },
        in_process: (infoDonation) => res.status(201).json({ data: infoDonation, message: "pending donation" }),
        rejected: (infoDonation) => res.status(201).json({ data: infoDonation, message: "donation rejected" }),
        default: (infoDonation) => res.status(201).json({ data: infoDonation, error: "error" })
      }
      const infoDonation = await Donations.create(infoPayment)
      return newDonation[status](infoDonation) || newDonation.default
    }
    return res.status(400).json({ data: req.body });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

export const getDonationsById = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    const { userId } = req.params;
    const paymentsMercadoPago = await getPaymentsService();

    const foundationDonations = await Donations.findAll({
      attributes: ["idPaymentMercadoPago", "status", "id"],
      where: {
        toUserId: userId
      }
    })

    const updateStatusDonations = foundationDonations.map(async (donation) => {
      const paymentMercadoPago = paymentsMercadoPago.find(payment => payment.id == donation.idPaymentMercadoPago)

      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
        currency_id,
      } = paymentMercadoPago;

      const { from_user, to_user } = metadata;

      if (donation.status !== status) {

        const newDonation = {
          approved: async () => {
            let mailDetail = {
              header: `Adoptame`,
              toMail: to_user.email,
              subject: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              titulo: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              mensaje: `Para la fundación: ${to_user.name}`,
            }
            autoEmail(mailDetail)

            const updateStatus = await Donations.update({
              status: status,
              status_detail: status_detail,
              comision_amount: fee_details[0]?.amount ?? 0,
              acredit_amount: transaction_details.net_received_amount,
              total_amount: transaction_details.total_paid_amount,
              currency: currency_id
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
            return await findDonationById(updateStatus.idPaymentMercadoPago);
          },
          in_process: async () => {
            const updateStatus = await Donations.update({
              status: status
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
            return await findDonationById(updateStatus.idPaymentMercadoPago);
          },
          rejected: async () => {
            const updateStatus = await Donations.update({
              status: status
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
            return await findDonationById(updateStatus.idPaymentMercadoPago);
          },
          default: () => { }
        }

        /*         switch (status) {
                  case 'in_process':
                    return Donations.update({
                      status: status
                    }, {
                      where: {
                        idPaymentMercadoPago: donation.idPaymentMercadoPago
                      },
                      returning: true,
                      plain: true,
                    })
                  case 'rejected':
                    return Donations.update({
                      status: status
                    }, {
                      where: {
                        idPaymentMercadoPago: donation.idPaymentMercadoPago
                      },
                      returning: true,
                      plain: true,
                    })
                  case 'approved':
        
                    let mailDetail = {
                      header: `Adoptame`,
                      toMail: to_user.email,
                      subject: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
                      titulo: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
                      mensaje: `Para la fundación: ${to_user.name}`,
                    }
                    autoEmail(mailDetail)
        
                    return await Donations.update({
                      status: status,
                      status_detail: status_detail,
                      comision_amount: fee_details[0]?.amount ?? 0,
                      acredit_amount: transaction_details.net_received_amount,
                      total_amount: transaction_details.total_paid_amount,
                      currency: currency_id
                    }, {
                      where: {
                        idPaymentMercadoPago: donation.idPaymentMercadoPago
                      },
                      returning: true,
                      plain: true,
                    })
                  default:
                    break;
                } */

        return newDonation[status]()
      }
      return findDonationById(donation.id);
/*       return Donations.findOne({
        attributes: { exclude: ['idPaymentMercadoPago'] },

        where: {
          id: donation.id
        }
      }) */
    });

    await Promise.all(updateStatusDonations);
    const donations = await Donations.findAll({
      attributes: { exclude: ['idPaymentMercadoPago'] },
      where: {
        toUserId: userId
      }
    })
    return res.status(200).json(donations);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

export const getDonations = async (req, res) => {
  // #swagger.tags = ['DONATION']
  try {
    const paymentsMercadoPago = await getPaymentsService();

    const foundationDonations = await Donations.findAll({
      attributes: ["idPaymentMercadoPago", "status", "id"]
    })

    const updateStatusDonations = foundationDonations.map(async (donation) => {
      const paymentMercadoPago = paymentsMercadoPago.find(payment => payment.id == donation.idPaymentMercadoPago)

      const {
        id, // idPaymentMercadoPago
        metadata,
        status,
        status_detail,
        fee_details,
        transaction_details,
        currency_id,
      } = paymentMercadoPago;

      const {
        from_user,
        to_user,
      } = metadata;

      if (donation.status !== status) {
        switch (status) {
          case 'in_process':
            return Donations.update({
              status: status
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
          case 'rejected':
            return Donations.update({
              status: status
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
          case 'approved':

            let mailDetail = {
              header: `Adoptame`,
              toMail: to_user.email,
              subject: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              titulo: `${from_user.name} te ha donado ${transaction_details.net_received_amount} ${currency_id}`,
              mensaje: `Para la fundación: ${to_user.name}`,
            }
            autoEmail(mailDetail)

            return await Donations.update({
              status: status,
              status_detail: status_detail,
              comision_amount: fee_details[0]?.amount ?? 0,
              acredit_amount: transaction_details.net_received_amount,
              total_amount: transaction_details.total_paid_amount,
              currency: currency_id
            }, {
              where: {
                idPaymentMercadoPago: donation.idPaymentMercadoPago
              },
              returning: true,
              plain: true,
            })
          default:
            break;
        }
      }

      return Donations.findOne({
        attributes: { exclude: ['idPaymentMercadoPago'] },
        where: {
          id: donation.id
        }
      })
    });

    await Promise.all(updateStatusDonations);
    const donations = await Donations.findAll({
      attributes: { exclude: ['idPaymentMercadoPago'] }
    })
    return res.status(200).json(donations);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}
