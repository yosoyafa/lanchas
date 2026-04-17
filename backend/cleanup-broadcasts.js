const { PrismaClient } = require('@prisma/client');
const cloudinary = require('./src/config/cloudinary');
require('dotenv').config();

const prisma = new PrismaClient();

async function cleanupBroadcasts() {
  console.log('🧹 Iniciando limpieza de broadcasts...\n');

  try {
    // 1. Obtener todas las reservas de broadcasts
    const broadcasts = await prisma.booking.findMany({
      where: {
        customerPhone: 'status@broadcast'
      }
    });

    console.log(`📊 Encontradas ${broadcasts.length} reservas de broadcasts\n`);

    if (broadcasts.length === 0) {
      console.log('✅ No hay nada que limpiar');
      await prisma.$disconnect();
      return;
    }

    // 2. Eliminar imágenes de Cloudinary
    console.log('🗑️  Eliminando imágenes de Cloudinary...');
    let deletedFromCloudinary = 0;
    let erroredCloudinary = 0;

    for (const booking of broadcasts) {
      if (booking.paymentReceiptUrl) {
        try {
          // Extraer el public_id de la URL
          // URL format: https://res.cloudinary.com/dl9gjjvm5/image/upload/v1776463379/boat-receipts/xyz.jpg
          const urlParts = booking.paymentReceiptUrl.split('/');
          const filename = urlParts[urlParts.length - 1].split('.')[0];
          const publicId = `boat-receipts/${filename}`;

          await cloudinary.uploader.destroy(publicId);
          deletedFromCloudinary++;
          console.log(`  ✓ Eliminado: ${filename}`);
        } catch (error) {
          erroredCloudinary++;
          console.log(`  ✗ Error eliminando: ${booking.paymentReceiptUrl}`);
          console.log(`    ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Cloudinary: ${deletedFromCloudinary} eliminadas, ${erroredCloudinary} errores\n`);

    // 3. Eliminar de la base de datos
    console.log('🗑️  Eliminando registros de la base de datos...');

    const result = await prisma.booking.deleteMany({
      where: {
        customerPhone: 'status@broadcast'
      }
    });

    console.log(`✅ Base de datos: ${result.count} registros eliminados\n`);

    // 4. Resumen final
    console.log('=' .repeat(50));
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('=' .repeat(50));
    console.log(`📸 Imágenes eliminadas de Cloudinary: ${deletedFromCloudinary}`);
    console.log(`📝 Registros eliminados de BD: ${result.count}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
cleanupBroadcasts();
