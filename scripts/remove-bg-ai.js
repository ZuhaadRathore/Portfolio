const { removeBackground } = require('@imgly/background-removal');
const fs = require('fs');
const path = require('path');

async function removeBgFromImage() {
  const inputPath = path.join(__dirname, '../public/images/pfp.webp');
  const outputPath = path.join(__dirname, '../public/images/pfp-nobg.png');

  console.log('Starting AI background removal...');
  console.log('This may take a minute as the AI model downloads and processes.\n');

  try {
    // Check if input exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }

    // Read the input image
    const imageBuffer = fs.readFileSync(inputPath);

    console.log('Processing image with AI (this may take 30-60 seconds)...');

    // Remove background using AI with Node.js configuration
    const blob = await removeBackground(imageBuffer, {
      publicPath: path.join(__dirname, '../node_modules/@imgly/background-removal/dist/'),
      output: {
        format: 'image/png',
        quality: 0.95
      },
      model: 'small' // Use smaller model for faster processing
    });

    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the result
    fs.writeFileSync(outputPath, buffer);

    console.log('\n✓ Background removed successfully!');
    console.log('✓ Saved to:', outputPath);

    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;

    console.log('\n--- File Size Info ---');
    console.log(`Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`No Background: ${(newSize / 1024).toFixed(2)} KB`);
    console.log('----------------------\n');

  } catch (error) {
    console.error('Error removing background:', error.message);
    console.error('\nIf the AI model download failed, you can:');
    console.error('1. Try running the script again');
    console.error('2. Use remove.bg instead (https://remove.bg)');
    process.exit(1);
  }
}

removeBgFromImage();
