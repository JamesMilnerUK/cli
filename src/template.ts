import { renderFile } from 'ejs';
import { dirname } from 'path';
import { writeFile, existsSync, mkdirSync } from 'fs-extra';
import chalk from 'chalk';

export function ejsRender(source: string, replacements: Object): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		renderFile(source, replacements, (err: Error, str?: string) => {
			if (err) {
				reject(err);
			}
			resolve(str);
		});
	});
}

export function writeRenderedFile(str: string, destination: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		console.log('?????? \n');
		ensureDirectoryExistence(destination);
		writeFile(destination, str, (err?: Error) => {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
}

export function ensureDirectoryExistence(filePath: string) {
	const directoryName = dirname(filePath);
	if (existsSync(directoryName)) {
		return true;
	}
	ensureDirectoryExistence(directoryName);
	mkdirSync(directoryName);
}

export default async function(source: string, destination: string, replacements: Object): Promise<void> {
	console.info(chalk.green.bold(' create ') + destination);
	const str = await ejsRender(source, replacements);
	await writeRenderedFile(str, destination);
}
