import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as detectIndent from 'detect-indent';
import { Helper } from '../interfaces';
import { loadExternalCommands } from '../allCommands';
import chalk from 'chalk';

const pkgDir = require('pkg-dir');

async function run(helper: Helper, args: {}) {
	const rootDir = pkgDir.sync(process.cwd());
	const dojoRcPath = join(rootDir, '.dojorc');
	const file = existsSync(dojoRcPath) && readFileSync(dojoRcPath, 'utf8');
	let json: { [name: string]: {} } = {};
	let indent = '\t';

	if (file) {
		indent = detectIndent(file).indent || indent;
		json = JSON.parse(file);
	}

	const groupMap = await loadExternalCommands();
	const values = [];

	for (let [, commandMap] of groupMap.entries()) {
		for (let [, value] of commandMap.entries()) {
			const name = `${value.group}-${value.name}`;
			if (values.indexOf(name) === -1 && json[name] === undefined) {
				json[name] = {};
				values.push(name);
			}
		}
	}

	writeFileSync(dojoRcPath, JSON.stringify(json, null, indent));
	console.log(chalk.white(`Successfully wrote .dojorc to ${dojoRcPath}`));
}

export default {
	name: '',
	group: 'init',
	description: 'create a .dojorc file',
	run,
	global: false,
	register: () => {}
};
