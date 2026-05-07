const express = require('express');
const router = express.Router();

// Privacy Policy page
router.get('/privacy-policy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Política de Privacidad - Lanchas Rental</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 { color: #0066cc; }
        h2 { color: #0052a3; margin-top: 30px; }
        .updated { color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1>Política de Privacidad</h1>
      <p class="updated">Última actualización: Mayo 2026</p>

      <h2>1. Información que Recopilamos</h2>
      <p>A través de nuestro servicio de WhatsApp, recopilamos:</p>
      <ul>
        <li>Número de teléfono de WhatsApp</li>
        <li>Nombre proporcionado durante la reserva</li>
        <li>Fecha de reserva solicitada</li>
        <li>Comprobantes de pago enviados</li>
        <li>Mensajes de conversación relacionados con la reserva</li>
      </ul>

      <h2>2. Uso de la Información</h2>
      <p>Utilizamos su información para:</p>
      <ul>
        <li>Procesar y confirmar reservas de lanchas</li>
        <li>Verificar pagos</li>
        <li>Comunicarnos sobre su reserva</li>
        <li>Mejorar nuestro servicio</li>
      </ul>

      <h2>3. Almacenamiento de Datos</h2>
      <p>Sus datos se almacenan de forma segura en nuestros servidores. Las imágenes de comprobantes de pago se almacenan en Cloudinary, un servicio seguro de almacenamiento en la nube.</p>

      <h2>4. Compartir Información</h2>
      <p>No compartimos, vendemos ni alquilamos su información personal a terceros. Solo compartimos datos con:</p>
      <ul>
        <li>WhatsApp (Meta) para el funcionamiento del servicio de mensajería</li>
        <li>Cloudinary para almacenamiento seguro de imágenes</li>
      </ul>

      <h2>5. Seguridad</h2>
      <p>Implementamos medidas de seguridad para proteger su información personal contra acceso no autorizado, alteración o destrucción.</p>

      <h2>6. Sus Derechos</h2>
      <p>Usted tiene derecho a:</p>
      <ul>
        <li>Acceder a sus datos personales</li>
        <li>Solicitar la corrección de datos inexactos</li>
        <li>Solicitar la eliminación de sus datos</li>
        <li>Retirar su consentimiento en cualquier momento</li>
      </ul>

      <h2>7. Retención de Datos</h2>
      <p>Conservamos sus datos mientras sea necesario para proporcionar nuestros servicios y cumplir con obligaciones legales.</p>

      <h2>8. WhatsApp Business API</h2>
      <p>Utilizamos WhatsApp Business API (operado por Meta) para comunicarnos con usted. Al usar nuestro servicio, usted acepta la política de privacidad de WhatsApp disponible en <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank">whatsapp.com/legal/privacy-policy</a>.</p>

      <h2>9. Cookies</h2>
      <p>Nuestro servicio de WhatsApp no utiliza cookies. Nuestro sitio web administrativo puede utilizar cookies básicas para el funcionamiento del sistema.</p>

      <h2>10. Cambios a esta Política</h2>
      <p>Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos a través de WhatsApp.</p>

      <h2>11. Contacto</h2>
      <p>Para consultas sobre privacidad o para ejercer sus derechos, contáctenos a través de WhatsApp al número de nuestro servicio.</p>

      <h2>12. Menores de Edad</h2>
      <p>Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores.</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 0.9em;">
        <strong>Lanchas Rental</strong><br>
        Servicio de Reserva de Lanchas<br>
        Colombia
      </p>
    </body>
    </html>
  `);
});

// Terms of Service page (optional but good to have)
router.get('/terms', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Términos de Servicio - Lanchas Rental</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 { color: #0066cc; }
        h2 { color: #0052a3; margin-top: 30px; }
        .updated { color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1>Términos de Servicio</h1>
      <p class="updated">Última actualización: Mayo 2026</p>

      <h2>1. Aceptación de Términos</h2>
      <p>Al utilizar nuestro servicio de reserva de lanchas a través de WhatsApp, usted acepta estos términos y condiciones.</p>

      <h2>2. Servicio</h2>
      <p>Ofrecemos servicio de reserva de lanchas a través de WhatsApp Business API. La disponibilidad está sujeta a confirmación.</p>

      <h2>3. Proceso de Reserva</h2>
      <ul>
        <li>Las reservas se realizan enviando "lancha" a nuestro WhatsApp</li>
        <li>Debe proporcionar fecha, número de lancha y nombre completo</li>
        <li>Debe enviar comprobante de pago para confirmar</li>
        <li>La reserva es confirmada solo después de verificar el pago</li>
      </ul>

      <h2>4. Pagos</h2>
      <ul>
        <li>Los pagos deben realizarse mediante transferencia bancaria</li>
        <li>El comprobante debe ser enviado por WhatsApp</li>
        <li>Las reservas sin comprobante no serán procesadas</li>
      </ul>

      <h2>5. Cancelaciones</h2>
      <p>Para políticas de cancelación y reembolso, contáctenos directamente por WhatsApp.</p>

      <h2>6. Responsabilidad</h2>
      <p>No nos hacemos responsables por condiciones climáticas adversas o circunstancias fuera de nuestro control que impidan el servicio.</p>

      <h2>7. Uso del Servicio</h2>
      <p>Usted acepta usar el servicio de manera responsable y conforme a las leyes aplicables.</p>

      <h2>8. Modificaciones</h2>
      <p>Nos reservamos el derecho de modificar estos términos. Los cambios serán notificados a través de WhatsApp.</p>
    </body>
    </html>
  `);
});

module.exports = router;
