// تبدیل عکس‌ها به base64
const fs = require('fs');
const path = require('path');

const imagesToConvert = [
  'logo.png',
  'mainPage1.png',
  'mainpage2.jpg',
  'asatid.jpg',
  'aboutuspic.png',
  'ourclass.jpg',
  'mainpage4pics3.png',
  'mainpagefourpics1.jpg',
  'mainpagefourpics2.png',
  'mainPagefourpics4.jpg',
  'sabt.jpg'
];

const base64Images = {};

imagesToConvert.forEach(imgName => {
  try {
    const imgPath = path.join(__dirname, 'public', 'pics', imgName);
    const imgBuffer = fs.readFileSync(imgPath);
    const base64 = imgBuffer.toString('base64');
    const ext = path.extname(imgName).slice(1);
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    base64Images[imgName] = `data:${mimeType};base64,${base64}`;
    console.log(`✓ Converted: ${imgName}`);
  } catch (err) {
    console.log(`✗ Error: ${imgName} - ${err.message}`);
  }
});

// ساخت فایل constants
const output = `// Base64 encoded images
export const images = ${JSON.stringify(base64Images, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'assets', 'images.js'), output);
console.log('\n✓ Created src/assets/images.js');
