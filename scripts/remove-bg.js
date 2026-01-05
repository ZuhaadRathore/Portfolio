const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeBackground() {
  const inputPath = path.join(__dirname, '../public/images/pfp.jpg');
  const outputPath = path.join(__dirname, '../public/images/pfp-nobg.png');

  try {
    console.log('Processing image for background removal...');
    console.log('Note: Automated background removal has limitations.');
    console.log('For best results, use a dedicated tool like remove.bg or Photoshop.\n');

    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Simple approach: Convert to PNG with alpha channel
    // This doesn't actually remove the background but prepares the file
    await sharp(inputPath)
      .png()
      .toFile(outputPath);

    console.log('✓ Image converted to PNG format with alpha channel support');
    console.log('✓ Saved to:', outputPath);
    console.log('\n--- Next Steps ---');
    console.log('To properly remove the background, you can:');
    console.log('1. Use remove.bg (https://remove.bg) - drag and drop pfp.jpg');
    console.log('2. Use Photoshop/GIMP with manual selection');
    console.log('3. Use an AI tool like Clipdrop or PhotoRoom');
    console.log('4. Save the result as pfp-nobg.png in public/images/');
    console.log('-------------------\n');

    // Get file size
    const pngSize = fs.statSync(outputPath).size;
    console.log(`PNG file size: ${(pngSize / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('Error processing image:', error);
    process.exit(1);
  }
}

removeBackground();
