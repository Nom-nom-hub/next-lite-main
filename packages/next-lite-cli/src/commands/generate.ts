import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface GenerateOptions {
  directory?: string;
  typescript: boolean;
}

export async function generateComponent(
  type: string,
  name: string,
  options: GenerateOptions
): Promise<void> {
  const spinner = ora(`Generating ${type}...`).start();
  
  try {
    // Validate type
    const validTypes = ['component', 'page', 'api'];
    if (!validTypes.includes(type)) {
      spinner.fail(`Invalid type: ${chalk.red(type)}. Valid types are: ${validTypes.join(', ')}`);
      return;
    }
    
    // Determine file extension
    const extension = options.typescript 
      ? type === 'api' ? '.ts' : '.tsx'
      : type === 'api' ? '.js' : '.jsx';
    
    // Determine directory
    let directory: string;
    switch (type) {
      case 'component':
        directory = path.resolve(process.cwd(), options.directory || 'components');
        break;
      case 'page':
        directory = path.resolve(process.cwd(), options.directory || 'pages');
        break;
      case 'api':
        directory = path.resolve(process.cwd(), options.directory || 'pages/api');
        break;
      default:
        directory = process.cwd();
    }
    
    // Create directory if it doesn't exist
    await fs.ensureDir(directory);
    
    // Create file path
    const filePath = path.join(directory, `${name}${extension}`);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      spinner.fail(`File ${chalk.cyan(filePath)} already exists.`);
      return;
    }
    
    // Generate content based on type
    let content: string;
    switch (type) {
      case 'component':
        content = generateComponentContent(name, options.typescript);
        break;
      case 'page':
        content = generatePageContent(name, options.typescript);
        break;
      case 'api':
        content = generateApiContent(name, options.typescript);
        break;
      default:
        content = '';
    }
    
    // Write file
    await fs.writeFile(filePath, content);
    
    spinner.succeed(`Generated ${chalk.green(type)}: ${chalk.cyan(filePath)}`);
    
  } catch (error) {
    spinner.fail(`Failed to generate ${type}.`);
    console.error(error);
  }
}

function generateComponentContent(name: string, isTypescript: boolean): string {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  
  if (isTypescript) {
    return `import React from 'react';

interface ${componentName}Props {
  // Define your props here
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div>
      <h1>${componentName} Component</h1>
    </div>
  );
};

export default ${componentName};
`;
  } else {
    return `import React from 'react';

const ${componentName} = (props) => {
  return (
    <div>
      <h1>${componentName} Component</h1>
    </div>
  );
};

export default ${componentName};
`;
  }
}

function generatePageContent(name: string, isTypescript: boolean): string {
  const pageName = name.charAt(0).toUpperCase() + name.slice(1);
  
  if (isTypescript) {
    return `import React from 'react';
import Head from 'next/head';

const ${pageName}Page: React.FC = () => {
  return (
    <>
      <Head>
        <title>${pageName} | Next-Lite</title>
        <meta name="description" content="${pageName} page" />
      </Head>
      
      <main>
        <h1>${pageName} Page</h1>
      </main>
    </>
  );
};

export default ${pageName}Page;
`;
  } else {
    return `import React from 'react';
import Head from 'next/head';

const ${pageName}Page = () => {
  return (
    <>
      <Head>
        <title>${pageName} | Next-Lite</title>
        <meta name="description" content="${pageName} page" />
      </Head>
      
      <main>
        <h1>${pageName} Page</h1>
      </main>
    </>
  );
};

export default ${pageName}Page;
`;
  }
}

function generateApiContent(name: string, isTypescript: boolean): string {
  if (isTypescript) {
    return `import { NextApiRequest, NextApiResponse } from 'next-lite';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ message: 'Hello from ${name} API route' });
}
`;
  } else {
    return `export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from ${name} API route' });
}
`;
  }
}
