import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'firebase-sw.template.js');
const outputPath = path.join(__dirname, 'public', 'firebase-messaging-sw.js');

let template = fs.readFileSync(templatePath, 'utf8');

template = template.replace('%%VITE_FIREBASE_API_KEY%%', process.env.VITE_FIREBASE_API_KEY || '');
template = template.replace('%%VITE_FIREBASE_AUTH_DOMAIN%%', process.env.VITE_FIREBASE_AUTH_DOMAIN || '');
template = template.replace('%%VITE_FIREBASE_PROJECT_ID%%', process.env.VITE_FIREBASE_PROJECT_ID || '');
template = template.replace('%%VITE_FIREBASE_STORAGE_BUCKET%%', process.env.VITE_FIREBASE_STORAGE_BUCKET || '');
template = template.replace('%%VITE_FIREBASE_MESSAGING_SENDER_ID%%', process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '');
template = template.replace('%%VITE_FIREBASE_APP_ID%%', process.env.VITE_FIREBASE_APP_ID || '');

fs.writeFileSync(outputPath, template);
console.log('Service Worker wygenerowany pomyślnie z użyciem zmiennych środowiskowych!');