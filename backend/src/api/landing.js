const express = require('express');
const router = express.Router();
const { BOAT_IMAGES } = require('../config/messages');

// Landing page
router.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alquiler de Lanchas - Reserva por WhatsApp</title>
      <meta name="description" content="Alquila lanchas de forma fácil y rápida por WhatsApp. Dos opciones disponibles con capacidad de hasta 12 personas.">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        header {
          text-align: center;
          padding: 40px 20px;
          color: white;
        }

        h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
          font-size: 1.2em;
          opacity: 0.95;
        }

        .boats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin: 40px 0;
        }

        .boat-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .boat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .boat-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }

        .boat-info {
          padding: 25px;
        }

        .boat-title {
          font-size: 1.8em;
          color: #667eea;
          margin-bottom: 15px;
        }

        .boat-details {
          list-style: none;
          margin: 20px 0;
        }

        .boat-details li {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
        }

        .boat-details li:last-child {
          border-bottom: none;
        }

        .icon {
          margin-right: 10px;
          font-size: 1.2em;
        }

        .cta-section {
          background: white;
          border-radius: 15px;
          padding: 40px;
          text-align: center;
          margin: 40px 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .cta-title {
          font-size: 2em;
          color: #667eea;
          margin-bottom: 20px;
        }

        .whatsapp-button {
          display: inline-block;
          background: #25D366;
          color: white;
          padding: 18px 40px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 1.3em;
          font-weight: bold;
          margin-top: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-button:hover {
          background: #20BA5A;
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        .whatsapp-icon {
          vertical-align: middle;
          margin-right: 10px;
          font-size: 1.2em;
        }

        .steps {
          background: white;
          border-radius: 15px;
          padding: 40px;
          margin: 40px 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .steps h2 {
          color: #667eea;
          text-align: center;
          margin-bottom: 30px;
          font-size: 2em;
        }

        .step {
          display: flex;
          align-items: start;
          margin: 25px 0;
          padding: 20px;
          background: #f8f9ff;
          border-radius: 10px;
        }

        .step-number {
          background: #667eea;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2em;
          flex-shrink: 0;
          margin-right: 20px;
        }

        .step-content h3 {
          color: #764ba2;
          margin-bottom: 8px;
        }

        footer {
          text-align: center;
          padding: 30px;
          color: white;
          opacity: 0.9;
        }

        footer a {
          color: white;
          text-decoration: underline;
          margin: 0 10px;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2em;
          }

          .subtitle {
            font-size: 1em;
          }

          .cta-title {
            font-size: 1.5em;
          }

          .whatsapp-button {
            font-size: 1.1em;
            padding: 15px 30px;
          }

          .step {
            flex-direction: column;
          }

          .step-number {
            margin-bottom: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>⛵ Alquiler de Lanchas</h1>
          <p class="subtitle">Reserva fácil y rápido por WhatsApp</p>
        </header>

        <div class="boats-container">
          <div class="boat-card">
            <img src="${BOAT_IMAGES.boat1}" alt="Lancha 1" class="boat-image">
            <div class="boat-info">
              <h2 class="boat-title">🚤 Lancha 1</h2>
              <ul class="boat-details">
                <li><span class="icon">👥</span> Capacidad: 10 personas</li>
                <li><span class="icon">💰</span> Precio: Consultar</li>
                <li><span class="icon">⚡</span> Motor potente</li>
                <li><span class="icon">🎵</span> Equipo de sonido</li>
                <li><span class="icon">☂️</span> Toldo incluido</li>
              </ul>
            </div>
          </div>

          <div class="boat-card">
            <img src="${BOAT_IMAGES.boat2}" alt="Lancha 2" class="boat-image">
            <div class="boat-info">
              <h2 class="boat-title">🚤 Lancha 2</h2>
              <ul class="boat-details">
                <li><span class="icon">👥</span> Capacidad: 12 personas</li>
                <li><span class="icon">💰</span> Precio: Consultar</li>
                <li><span class="icon">⚡</span> Motor de alta gama</li>
                <li><span class="icon">🎵</span> Sistema de audio premium</li>
                <li><span class="icon">☂️</span> Toldo amplio</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h2 class="cta-title">¿Listo para reservar?</h2>
          <p style="font-size: 1.1em; color: #666; margin: 20px 0;">
            Es muy fácil. Solo envía <strong>"lancha"</strong> por WhatsApp y nuestro sistema automático te guiará.
          </p>
          <a href="https://wa.me/TUNUMERO?text=lancha" class="whatsapp-button" target="_blank">
            <span class="whatsapp-icon">💬</span>
            Reservar por WhatsApp
          </a>
        </div>

        <div class="steps">
          <h2>📋 ¿Cómo funciona?</h2>

          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Envía "lancha" por WhatsApp</h3>
              <p>Haz click en el botón de arriba o envía un mensaje con la palabra "lancha" a nuestro WhatsApp.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Elige fecha y lancha</h3>
              <p>Recibirás fotos de nuestras lanchas. Indica qué fecha necesitas y cuál lancha prefieres.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Proporciona tu nombre</h3>
              <p>Envía tu nombre completo para la reserva.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Realiza el pago</h3>
              <p>Recibirás las instrucciones de pago. Envía el comprobante por WhatsApp.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>¡Confirmación automática!</h3>
              <p>Una vez verificado tu pago, recibirás la confirmación de tu reserva. ¡Listo para disfrutar!</p>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <p style="font-size: 1.2em; color: #666;">
            ✨ Proceso 100% automático • ⚡ Respuesta inmediata • 🔒 Pago seguro
          </p>
        </div>

        <footer>
          <p>&copy; 2026 Alquiler de Lanchas</p>
          <div style="margin-top: 15px;">
            <a href="/privacy-policy">Política de Privacidad</a>
            <a href="/terms">Términos de Servicio</a>
          </div>
        </footer>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
