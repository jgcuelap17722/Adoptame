import nodemailer from "nodemailer";
import "dotenv/config";
import { html } from "../utils/email.js";
const {APP_EMAIL, APP_PASS_EMAIL} = process.env
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: APP_EMAIL, // generated ethereal user
        pass: APP_PASS_EMAIL, // generated ethereal passwor
    },
});


export const autoMail = async (header, toMail, subject,titulo, mensaje, {text, link}) => {

    // let button = {text: texto, link: un link}

    if (subject === undefined || !subject.length) {subject=header}
    if (titulo === undefined || !titulo.length) {titulo=header}
    await transporter.sendMail({
        from: `${header} <adoptaMe>`,
        to: toMail,
        subject: subject,
        html: html(titulo, mensaje, {text, link}),
      });
}