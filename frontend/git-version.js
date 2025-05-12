const { getLastCommit } = require('git-last-commit');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync, existsSync, mkdirSync } = require('fs-extra');

getLastCommit((err, gitInfo) => {    
    gitInfo.version = version;
    gitInfo.authoredOn = new Date(parseInt(gitInfo.authoredOn) * 1000);
    gitInfo.committedOn = new Date(parseInt(gitInfo.committedOn) * 1000);
    const rootDir = __dirname === '/' ? '' : __dirname;
    if (!existsSync(rootDir + '/src/environments')) {
        mkdirSync(rootDir + '/src/environments');
    }
    const file = resolve(rootDir, 'src', 'environments', 'version.ts');
    writeFileSync(file,
        `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
/* eslint-disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

    console.log(`Wrote version info ${JSON.stringify(gitInfo, null, 4)} to ${relative(resolve(rootDir, '..'), file)}`);
});