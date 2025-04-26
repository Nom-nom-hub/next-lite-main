'use strict';

const path = require('path');
const fs = require('fs-extra');
const { generateStaticSite } = require('../src/server/static-generation');

async function build() {
  const dir = process.cwd();
  const pagesDir = path.join(dir, 'pages');
  const outputDir = path.join(dir, '.next', 'static');
  
  console.log('🧹 Cleaning output directory...');
  await fs.emptyDir(outputDir);
  
  console.log('📦 Generating static site...');
  try {
    const generatedFiles = await generateStaticSite({
      pagesDir,
      outputDir
    });
    
    console.log(`✨ Generated ${generatedFiles.length} static pages!`);
    
    // Copy public files
    const publicDir = path.join(dir, 'public');
    if (fs.existsSync(publicDir)) {
      console.log('📂 Copying public files...');
      await fs.copy(publicDir, outputDir);
    }
    
    console.log('✨ Static build complete!');
  } catch (error) {
    console.error('❌ Static build failed:', error);
    process.exit(1);
  }
}

build();
