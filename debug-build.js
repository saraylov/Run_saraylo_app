import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { promises as fs } from 'fs';

// Получаем путь к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function debugBuild() {
  try {
    console.log('Начинаем отладочную сборку...');
    console.log('Текущая директория:', __dirname);
    
    // Проверяем существование директории dist
    const distPath = resolve(__dirname, 'dist');
    console.log('Путь к dist:', distPath);
    
    try {
      await fs.access(distPath);
      console.log('Директория dist существует');
    } catch (error) {
      console.log('Директория dist не существует, создаем...');
      await fs.mkdir(distPath, { recursive: true });
    }
    
    // Выполняем сборку
    console.log('Выполняем сборку...');
    const result = await build({
      root: __dirname,
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
      },
      logLevel: 'info'
    });
    
    console.log('Сборка завершена');
    
    // Проверяем содержимое директории dist после сборки
    console.log('Проверяем содержимое директории dist после сборки...');
    try {
      const files = await fs.readdir(distPath);
      console.log('Файлы в dist:', files);
      
      for (const file of files) {
        const filePath = resolve(distPath, file);
        const stat = await fs.stat(filePath);
        console.log(`  ${file}: ${stat.isDirectory() ? 'директория' : 'файл'}`);
        
        if (stat.isDirectory()) {
          const subFiles = await fs.readdir(filePath);
          console.log(`    содержимое ${file}:`, subFiles);
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке содержимого dist:', error);
    }
    
  } catch (error) {
    console.error('Ошибка при сборке:', error);
  }
}

debugBuild();