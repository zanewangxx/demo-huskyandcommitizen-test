#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs';

// Load the configuration file that lists global file paths
const configFile = 'global-files.config.json';
let globalFilesConfig = [];
try {
  globalFilesConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (error) {
  console.error(`Error loading ${configFile}:`, error);
  process.exit(1);
}

(async () => {
  try {
    // Get a list of staged files
    const stdout = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const stagedFiles = stdout.split('\n').filter(Boolean);

    // Check if any staged file is in our global files list from the config
    const modifiedGlobalFiles = stagedFiles.filter(file =>
      globalFilesConfig.includes(file)
    );

    if (modifiedGlobalFiles.length > 0) {
      console.log('Detected changes in global files:');
      console.log(modifiedGlobalFiles.join('\n'));

      // Prompt the user for confirmation
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: '🚨 Are you sure you want to proceed with this commit? 🚨',
          default: false
        }
      ]);

      if (!proceed) {
        console.log('Commit aborted by user.');
        process.exit(1);
      }
    }
    
    // If approved (or no global files), launch Commitizen
    const commitProcess = spawn('npx', ['git-cz'], { stdio: 'inherit' });
    commitProcess.on('close', code => process.exit(code));
  } catch (error) {
    console.error('Error during commit wrapper:', error);
    process.exit(1);
  }
})();

