const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Validación preventiva para depuración
if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('⚠️ ADVERTENCIA: EMAIL_USER o EMAIL_PASS no están definidos en el .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Verificar la conexión con el servidor de correo al arrancar
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error en configuración de Nodemailer:', error.message);
  } else {
    console.log('📧 Servidor de correos listo para enviar mensajes');
  }
});

exports.sendVerificationEmail = async (to, code) => {
  try {
    await transporter.sendMail({
      from: `"Vainilla y Miel" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verifica tu cuenta',
      text: `Tu código de verificación es: ${code}`,
      html: `
      <div style="
        font-family: Arial, sans-serif;
        background:#f8f5f2;
        padding:40px 20px;
      ">
        <div style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 4px 20px rgba(0,0,0,.08);
        ">
          
          <div style="
            background:#d89c5f;
            padding:24px;
            text-align:center;
            color:white;
          ">
            <h1 style="margin:0;">
              🍰 Vainilla y Miel
            </h1>
          </div>

          <div style="padding:40px 30px;">
            <h2 style="
              color:#333;
              text-align:center;
              margin-bottom:20px;
            ">
              Verifica tu cuenta
            </h2>

            <p style="
              color:#666;
              font-size:16px;
              text-align:center;
              line-height:1.6;
            ">
              Gracias por registrarte en Vainilla y Miel.
              Utiliza el siguiente código para verificar tu cuenta:
            </p>

            <div style="
              text-align:center;
              margin:30px 0;
            ">
              <span style="
                display:inline-block;
                background:#fff4e6;
                border:2px dashed #d89c5f;
                color:#d89c5f;
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                padding:18px 30px;
                border-radius:12px;
              ">
                ${code}
              </span>
            </div>

            <p style="
              color:#777;
              text-align:center;
              font-size:14px;
            ">
              Este código expirará en 15 minutos.
            </p>

            <hr style="
              border:none;
              border-top:1px solid #eee;
              margin:30px 0;
            ">

            <p style="
              color:#999;
              font-size:12px;
              text-align:center;
            ">
              Si no solicitaste este registro, puedes ignorar este mensaje.
            </p>
          </div>
        </div>
      </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de verificación:', error.message);
    throw new Error(
      'No se pudo enviar el correo de verificación. Revisa las credenciales SMTP.'
    );
  }
};

exports.sendResetPasswordEmail = async (to, code) => {
  try {
    await transporter.sendMail({
      from: `"Vainilla y Miel" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      text: `Tu código para recuperar tu contraseña es: ${code}`,
      html: `
      <div style="font-family: Arial, sans-serif; background:#f8f5f2; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; padding:40px; box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <h1 style="color:#d89c5f; text-align:center;">🍰 Vainilla y Miel</h1>
          <h2 style="color:#333; text-align:center;">Recuperación de contraseña</h2>
          <p style="color:#666; font-size:16px; line-height:1.6; text-align:center;">Has solicitado restablecer tu contraseña. Utiliza el siguiente código:</p>
          <div style="text-align:center; margin:30px 0;">
            <span style="display:inline-block; background:#fff4e6; border:2px dashed #d89c5f; color:#d89c5f; font-size:32px; font-weight:bold; letter-spacing:8px; padding:18px 30px; border-radius:12px;">${code}</span>
          </div>
          <p style="color:#999; font-size:12px; text-align:center;">Si no solicitaste este cambio, puedes ignorar este correo. El código expirará en 10 minutos.</p>
        </div>
      </div>`
    });
  } catch (error) {
    console.error('Error enviando email de recuperación:', error.message);
    throw error;
  }
};

exports.sendPasswordChangedEmail = async (to) => {
  try {
    await transporter.sendMail({
      from: `"Vainilla y Miel" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Contraseña actualizada con éxito',
      html: `
      <div style="font-family: Arial, sans-serif; background:#f8f5f2; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; padding:40px; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <h1 style="color:#d89c5f;">🍰 Vainilla y Miel</h1>
          <h2 style="color:#333;">¡Contraseña Actualizada!</h2>
          <p style="color:#666; font-size:16px; line-height:1.6;">
            Hola, te informamos que la contraseña de tu cuenta ha sido modificada exitosamente.
          </p>
          <div style="background:#e6f4ee; color:#2e7d52; padding:15px; border-radius:12px; font-weight:bold; margin:20px 0;">
            Cambio realizado con éxito
          </div>
          <p style="color:#999; font-size:12px;">
            Si no realizaste este cambio, por favor contacta a nuestro equipo de soporte de inmediato.
          </p>
        </div>
      </div>
      `
    });
  } catch (error) {
    console.error('Error enviando email de confirmación:', error.message);
  }
};