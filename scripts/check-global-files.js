#!/usr/bin/env node
import { execSync } from 'child_process';
import inquirer from 'inquirer';

(async () => {
  try {
    // Get a list of staged files
    const stdout = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const stagedFiles = stdout.split('\n').filter(Boolean);
    
    // Check if any staged file is in the global folder
    const globalFiles = stagedFiles.filter(file => file.includes('/global/') || file.startsWith('src/global/'));
    
    if (globalFiles.length > 0) {
      console.log('Detected changes in global files:');
      console.log(globalFiles.join('\n'));

      // Optionally, remove the TTY check so the prompt always appears:
      // if (!process.stdin.isTTY) {
      //   console.log('Non-interactive environment detected; aborting commit.');
      //   process.exit(1);
      // }
      
      let proceed;
      try {
        // Prompt the user for confirmation
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: '🚨Are you sure you want to proceed with this commit?🚨',
            default: false
          }
        ]);
        proceed = answers.proceed;
      } catch (promptError) {
        console.log('Prompt was closed unexpectedly; aborting commit.');
        process.exit(1);
      }
      
      if (!proceed) {
        console.log('Commit aborted by user.');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error checking global files:', error);
    process.exit(1);
  }
})();
