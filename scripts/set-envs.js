const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

if (!process.env.MAPBOX_TOKEN) {
  throw new Error('No MAPBOX_TOKEN found in environment variables');
}

const envFileContent = `export const environment = {
  production: false,
  mapboxToken: '${process.env.MAPBOX_TOKEN}'
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
