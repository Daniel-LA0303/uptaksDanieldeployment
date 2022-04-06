const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util')
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
});

//generar html
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);    
}

exports.enviar = async(opciones) => {

    const html = generarHTML(opciones.archivo, opciones) //para modificar los estilos del email
    const text =  htmlToText.fromString(html);

    let mailOptions = {
        from: 'UpTask <no-reply@uptaks.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text :text,
        html: html 
    }

    const enviarEmail = util.promisify(transport.sendMail, transport); //lo volvemos asincrono
    return enviarEmail.call(transport, mailOptions);

    transport.sendMail(mailOptions);

}



