const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertImage() {
  const inputPath = path.join(__dirname, '../public/images/pfp.jpg');
  const outputWebP = path.join(__dirname, '../public/images/pfp.webp');
  const outputAvif = path.join(__dirname, '../public/images/pfp.avif');

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }

    // Convert to WebP with high quality
    await sharp(inputPath)
      .webp({ quality: 90, effort: 6 })
      .toFile(outputWebP);
    console.log('✓ WebP image created successfully');

    // Convert to AVIF with high quality
    await sharp(inputPath)
      .avif({ quality: 85, effort: 9 })
      .toFile(outputAvif);
    console.log('✓ AVIF image created successfully');

    // Get file sizes for comparison
    const jpgSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputWebP).size;
    const avifSize = fs.statSync(outputAvif).size;

    console.log('\n--- File Size Comparison ---');
    console.log(`JPG:  ${(jpgSize / 1024).toFixed(2)} KB`);
    console.log(`WebP: ${(webpSize / 1024).toFixed(2)} KB (${((1 - webpSize / jpgSize) * 100).toFixed(1)}% smaller)`);
    console.log(`AVIF: ${(avifSize / 1024).toFixed(2)} KB (${((1 - avifSize / jpgSize) * 100).toFixed(1)}% smaller)`);
    console.log('----------------------------\n');

  } catch (error) {
    console.error('Error converting image:', error);
    process.exit(1);
  }
}

convertImage();
