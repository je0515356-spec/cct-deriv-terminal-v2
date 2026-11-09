const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function main() {
  const now = new Date();

  // -------------------------------------------------------------
  // 1. CLOUDFLARE PAGES READY-TO-DEPLOY ZIP
  // Contains only index.html, assets/, _redirects, and instructions
  // -------------------------------------------------------------
  const deployZip = new JSZip();
  const distDir = path.resolve(__dirname, '..', 'dist');

  function addDirRecursively(dir, zipNode, basePath = '') {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.endsWith('.zip')) continue; // Strict exclusion of zips!
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subNode = zipNode.folder(entry);
        addDirRecursively(fullPath, subNode, path.join(basePath, entry));
      } else {
        const data = fs.readFileSync(fullPath);
        zipNode.file(entry, data, {
          date: now,
          unixPermissions: '644',
        });
      }
    }
  }

  addDirRecursively(distDir, deployZip);

  // Cloudflare Pages SPA Routing rule
  deployZip.file('_redirects', '/*    /index.html   200\n', {
    date: now,
    unixPermissions: '644',
  });

  deployZip.file(
    'LISEZ_MOI_CLOUDFLARE.txt',
    `========================================================================
CCT — CROWN COME TRADER V9.0 FINAL
GUIDE OFFICIEL DE DEPLOIEMENT RAPIDE SUR CLOUDFLARE PAGES (100% GRATUIT)
========================================================================

Ce dossier contient votre application de trading CCT deja compilee et
prete a l'emploi pour le monde entier avec HTTPS gratuit !

COMMENT DEPLOYER EN 1 MINUTE CHRONO SUR CLOUDFLARE PAGES :

1. Ouvrez votre navigateur et allez sur : https://dash.cloudflare.com
   (Creez un compte gratuit en 30 secondes si vous n'en avez pas encore).

2. Dans le menu de gauche, cliquez sur :
   "Workers et Pages"

3. Cliquez sur le bouton bleu :
   "Creer une application" (ou "Create an application")

4. Cliquez sur l'onglet :
   "Pages" (et NON "Workers")

5. Choisissez l'option :
   "Telecharger des elements" (ou "Direct Upload")

6. Donnez un nom a votre projet (par exemple : "crown-come-trader" ou "mon-cct")

7. Glissez-deposez CE DOSSIER extrait directement dans la zone de depot de Cloudflare.

8. Cliquez sur le bouton "Deployer le site".

C'EST TOUT ! Votre terminal de trading professionnel CCT est immediatement
en ligne sur votre adresse mondiale securisee :
https://VOTRE-NOM.pages.dev
========================================================================
`,
    { date: now, unixPermissions: '644' }
  );

  const deployBuffer = await deployZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    platform: 'DOS',
  });

  const publicDir = path.resolve(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const deployZipPath = path.join(publicDir, 'cct-cloudflare-pages-deploy.zip');
  fs.writeFileSync(deployZipPath, deployBuffer);
  console.log('Generated:', deployZipPath, 'Size:', deployBuffer.length, 'bytes');

  // -------------------------------------------------------------
  // 2. FULL SOURCE CODE ZIP (src, configs, package.json)
  // -------------------------------------------------------------
  const sourceZip = new JSZip();
  const rootDir = path.resolve(__dirname, '..');

  const rootFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    '.env.example',
    'metadata.json',
  ];

  for (const rf of rootFiles) {
    const fp = path.join(rootDir, rf);
    if (fs.existsSync(fp)) {
      sourceZip.file(rf, fs.readFileSync(fp), { date: now, unixPermissions: '644' });
    }
  }

  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    const srcNode = sourceZip.folder('src');
    addDirRecursively(srcDir, srcNode);
  }

  sourceZip.file(
    'README.md',
    `# CCT — CROWN COME TRADER V9.0 FINAL
ANALYSE • BACKTESTING • DISCIPLINE

## Code Source Complet
Pour installer en local ou developper :
1. npm install
2. npm run dev
3. npm run build
`,
    { date: now, unixPermissions: '644' }
  );

  const sourceBuffer = await sourceZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    platform: 'DOS',
  });

  const sourceZipPath = path.join(publicDir, 'cct-source-code.zip');
  fs.writeFileSync(sourceZipPath, sourceBuffer);
  console.log('Generated:', sourceZipPath, 'Size:', sourceBuffer.length, 'bytes');
}

main().catch((err) => {
  console.error('Error generating zips:', err);
  process.exit(1);
});
