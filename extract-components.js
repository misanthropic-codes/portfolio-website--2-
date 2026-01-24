const fs = require('fs');
const path = require('path');

const registryDir = 'temp_registry';
const componentsDir = 'components/ui';

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

const files = fs.readdirSync(registryDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const content = fs.readFileSync(path.join(registryDir, file), 'utf8');
    try {
      const json = JSON.parse(content);
      if (json.files) {
        json.files.forEach(f => {
          // Adjust path if needed
          const fileName = path.basename(f.path);
          const targetPath = path.join(componentsDir, fileName);
          console.log(`Writing ${targetPath}...`);
          fs.writeFileSync(targetPath, f.content);
        });
      }
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
});
