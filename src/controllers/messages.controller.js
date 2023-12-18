import nodemailer from "nodemailer";
import { GMAIL_PASSWORD, GMAIL_USER } from "../config/configs.js";
import __dirname from "../../utils.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Servidor listo para tomar nuestros mensajes.");
  }
});

const mailOptions = {
  from: "Coder Test " + GMAIL_USER,
  to: GMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",
  attachments: [],
};

const mailOptionsDelete = (reciver, title, message) => {
  return{
    from: "Okuna " + GMAIL_USER,
    to: reciver,
    subject: title ? title : "Correo para usuarios eliminados.",
    html: message ? message : "<div><h1>Se elimino tu cuenta por inactividad</h1></div>",
    attachments: [],
  }
};

const mailOptionsWithAttachments = {
  from: "Coder Test " + GMAIL_USER,
  to: GMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: `<div>
              <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
              <p>Ahora usando imagenes: </p>
              <img src="cid:okunaLogo"/>
          </div>`,
  attachments: [
    {
      filename: "Okuna",
      path: __dirname+'/src/public/images/okunaLogo.png',
      cid: "okunaLogo",
    },
  ],
};

export const sendEmail = (req, res) => {
  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: "Error", payload: error });
      }
      req.logger.info("Message sent: %s", info.messageId);
      res.send({ message: "Success!", payload: info });
    });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + GMAIL_USER,
      });
  }
};

export const sendEmailWithAttachments = (req, res) => {
  try {
    let result = transporter.sendMail(
      mailOptionsWithAttachments,
      (error, info) => {
        if (error) {
          req.logger.error(error);
          res.status(400).send({ message: "Error", payload: error });
        }
        req.logger.info("Message sent: %s", info.messageId);
        res.send({ message: "Success!", payload: info });
      }
    );
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + GMAIL_USER,
      });
  }
};

export const sendEmailForDeletedUsers = (email, message, title, callback) => {
  let finalEmail = email ? email : GMAIL_USER;
  try {
    let result = transporter.sendMail(mailOptionsDelete(finalEmail, title, message), (error, info) => {
      if (error) {
        function doSomething(callback) {
          callback({
              message: "Error",
              payload: error,
              code: 400
          });
        }
        function myCallback() {
          console.log("El callback se ejecutó.");
        }
        doSomething(myCallback);
      } else {
        callback (null, { message: "Success!", payload: info })
    }
    });
  } catch (error) {
    console.log(error);
  }
};