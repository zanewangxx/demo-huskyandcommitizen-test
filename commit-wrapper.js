#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import inquirer from 'inquirer';

(async () => {
  try {
    // Get a list of staged files
    const stdout = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const stagedFiles = stdout.split('\n').filter(Boolean);

    // Adjust this logic to match your project’s global folder location:
    const globalFiles = stagedFiles.filter(file =>
      file.includes('/global/') || file.startsWith('src/global/')
    );

    if (globalFiles.length > 0) {
      console.log('Detected changes in global files:');
      console.log(globalFiles.join('\n'));

      // Prompt the user for confirmation with a red warning light emoji
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
