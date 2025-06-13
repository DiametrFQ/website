/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const BASE_DIR = __dirname;
const OUTPUT_FILE = path.join(BASE_DIR, 'file_index.json');

// Читаем .gitignore
// const gitignorePath = path.join(BASE_DIR, '.gitignore');
const gitignoreBackendPath = path.join(BASE_DIR, 'backend', '.gitignore');
const gitignoreFrontendPath = path.join(BASE_DIR, 'frontend', '.gitignore');

const ig = ignore();

// Добавляем игнор из .gitignore
if (fs.existsSync(gitignoreBackendPath)) {
  const gitignoreContent = fs.readFileSync(gitignoreBackendPath, 'utf8');
  ig.add(gitignoreContent);
}

// Добавляем игнор из .gitignore
if (fs.existsSync(gitignoreFrontendPath)) {
  const gitignoreContent = fs.readFileSync(gitignoreFrontendPath, 'utf8');
  ig.add(gitignoreContent);
}

// Явно игнорируем .git
ig.add('.git');
ig.add('node_modules');
ig.add('**/node_modules');
ig.add('**/target/');
ig.add('**/.next/');
ig.add('package-lock.json');
ig.add('**/package-lock.json');
ig.add('**/Cargo.lock');
ig.add('public/');
ig.add('**/public/');

ig.add('**/*.config**');
ig.add('*.ico');

function collectFiles(dir, base = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(base, entry.name);

    // Игнорируем по правилам .gitignore + .git
    if (ig.ignores(relativePath)) continue;

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

const files = collectFiles(BASE_DIR);

const result = {};
for (const relPath of files) {
  const absPath = path.join(BASE_DIR, relPath);
  result[relPath] = fs.readFileSync(absPath, 'utf8');
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
console.log(`Создан файл ${OUTPUT_FILE} с ${files.length} файлами.`);
