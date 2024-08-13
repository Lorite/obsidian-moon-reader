import { Notice, Plugin, TFolder, TFile, TAbstractFile } from 'obsidian';
import { ExportSelecter } from 'src/suggester';
import { parse, parseChapters } from "src/parser";
import { generateOutput } from 'src/exporter';
import { SettingsTab } from './settings';
import { ColorPicker } from 'src/colorpicker';

export interface MoonReaderSettings {
	exportsPath: string;
	enableSRSSupport: boolean;
}

const MOONREADER_DEFAULT_SETTINGS: MoonReaderSettings = {
	exportsPath: 'Book Exports',
	enableSRSSupport: false
}

export default class MoonReader extends Plugin {
	settings: MoonReaderSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('book', 'Moon Reader', async () => await this.parse_export());

		this.addCommand({
			id: 'parse-exports',
			name: 'Parse an export',
			editorCallback: async () =>
				await this.parse_export()
		});
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	async parse_export() {
		const currentTFile = this.app.workspace.getActiveFile();
		if (!currentTFile) {
			new Notice("No active file!");
		}
		const rootPath: string = this.settings.exportsPath;
		const exportTFolder: TAbstractFile = this
			.app
			.vault
			.getAbstractFileByPath(rootPath);
		let exportedFilesMREXPT: TFile[];
		if (exportTFolder instanceof TFolder) {
			exportedFilesMREXPT = exportTFolder
				.children
				?.filter(
					(t) => (t instanceof TFile) && t.basename && t.extension == `mrexpt`
				)
				.map(t => t as TFile);
		} else {
			//sanity check
			new Notice("Invalid Folder Path");
			return;
		}
		if (!exportedFilesMREXPT.length) {
			new Notice("Folder does not have any Moon+ Reader exports!");
			return;
		}
		const suggesterModalMREXPT = new ExportSelecter(this.app, exportedFilesMREXPT);
		//TODO: raise error for no input?
		const mrexptChoice = await suggesterModalMREXPT.openAndGetValue().catch(e => { new Notice("Prompt cancelled"); }) as TFile;
		if (!mrexptChoice) {
			return;
		}

		let exportedFilesChapters: TFile[];
		if (exportTFolder instanceof TFolder) {
			exportedFilesChapters = exportTFolder
				.children
				?.filter(
					(t) => (t instanceof TFile) && t.basename && t.extension == `txt`
				)
				.map(t => t as TFile);
		} else {
			//sanity check
			new Notice("Invalid Folder Path");
			return;
		}
		const suggesterModalChapters = new ExportSelecter(this.app, exportedFilesChapters);
		const mrexptChaptersChoice = await suggesterModalChapters.openAndGetValue().catch(e => { new Notice("Prompt cancelled"); }) as TFile;
		if (!mrexptChoice) {
			return;
		}
		const parsedOutput = await parse(mrexptChoice);
		const mrexptChoiceChaptersTitles = await parseChapters(mrexptChaptersChoice) as string[];
		if (parsedOutput) {
			const colorChoices = new Set<number>();
			parsedOutput.forEach(t => colorChoices.add(t.signedColor))
			colorChoices.add(0);
			const colorModal = new ColorPicker(this.app, Array.from(colorChoices));
			const colorChoice = await colorModal.openAndGetValue()
			// .catch(e=>console.log(e));
			await this.app.vault.append(currentTFile, generateOutput(parsedOutput, mrexptChoice, mrexptChoiceChaptersTitles, colorChoice, this.settings.enableSRSSupport));
		} else {
			new Notice("Nothing added!");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, MOONREADER_DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
