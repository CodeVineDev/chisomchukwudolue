const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'input.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace('--text-pc-2: clamp(3rem, 9vw, 7.6rem);', '--text-pc-2: clamp(2.5rem, 8vw, 7.6rem);');
cssContent = cssContent.replace('--text-pc-3: clamp(2.8rem, 5vw, 4rem);', '--text-pc-3: clamp(2rem, 6vw, 4rem);');
fs.writeFileSync(cssPath, cssContent);

const htmlFiles = [
  'index.html',
  'src/project-1.html',
  'src/project-2.html',
  'src/project-3.html',
  'src/project-4.html',
  'src/project-5.html'
];

const replacements = [
  [/pt-32 pb-16 md:pt-48 md:pb-24/g, 'pt-24 pb-12 md:pt-48 md:pb-24'],
  [/py-24 md:py-32/g, 'py-16 md:py-32'],
  [/py-18 md:py-32/g, 'py-12 md:py-32'],
  [/p-10 md:p-16/g, 'p-6 md:p-16'],
  [/p-8 md:p-10/g, 'p-6 md:p-10'],
  [/p-8 lg:p-12/g, 'p-6 lg:p-12'],
  [/p-8 md:p-12 lg:p-16/g, 'p-6 md:p-12 lg:p-16'],
  [/p-8 md:p-12/g, 'p-6 md:p-12'],
  [/text-4xl md:text-7xl/g, 'text-3xl md:text-7xl'],
  [/text-xl md:text-2xl/g, 'text-lg md:text-2xl'],
  [/text-3xl md:text-5xl/g, 'text-2xl md:text-5xl'],
  [/text-3xl lg:text-5xl/g, 'text-2xl lg:text-5xl'],
  [/text-5xl md:text-7xl/g, 'text-4xl md:text-7xl'],
  [/text-5xl md:text-6xl/g, 'text-4xl md:text-6xl'],
  [/\bmb-24\b/g, 'mb-16 md:mb-24'],
  [/\bmb-16\b/g, 'mb-10 md:mb-16'],
  [/gap-12 lg:gap-16/g, 'gap-8 lg:gap-16'],
  [/gap-12 lg:gap-8/g, 'gap-8 lg:gap-8'],
  [/pb-24 md:pb-32/g, 'pb-16 md:pb-32']
];

for (const file of htmlFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [regex, repl] of replacements) {
      content = content.replace(regex, repl);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
console.log('Done.');
