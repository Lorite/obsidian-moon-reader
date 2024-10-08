import {Annotation} from 'src/types';
import {TFile} from 'obsidian';
import * as utilsFunctions from "./util";

export function generateOutput(listOfAnnotations: Annotation[], mrexptTFile: TFile, mrexptChoiceChapters: string[], colorFilter: number, enableNewExporter: boolean): string {
    const sample = listOfAnnotations[0];
    //TODO: extract into template
    // TODO: last exported ID is likely broken
	let output = `---
path: "${mrexptTFile.path}"
title: "${sample.bookName}"
author: 
lastExportedTimestamp: ${mrexptTFile.stat.mtime}
lastExportedID: ${listOfAnnotations[listOfAnnotations.length - 1].indexCount}
tags: 
  - "review/book"
---

`;

	let currentSectionNumber = 0;
    for (const annotation of listOfAnnotations) {
		if (colorFilter == 0 || annotation.signedColor == colorFilter) {
			let annotationAsString: string;
			if (annotation.sectionNumber != currentSectionNumber) {
				currentSectionNumber = annotation.sectionNumber;
				if (mrexptChoiceChapters.length >= currentSectionNumber)
					output += `${mrexptChoiceChapters[currentSectionNumber]}\n\n`;
				else
					output += `## Section ${currentSectionNumber}\n\n`;
			}

			if (annotation.highlightText) {
				annotationAsString = `${template(annotation, enableNewExporter)}\n`;
			}
			if (annotationAsString) {
				output += annotationAsString;
			}
		}
    }

    return output;
}

function template(annotation: Annotation, enableNewExporter: boolean) {
	let {indexCount, highlightText: highlight, noteText: note} = annotation;
	if (enableNewExporter) {
		if (note.trim() === "#") {
			return `# ${highlight.replace("\n", ": ")}\n`;
		}
		if (note.trim() === "##") {
			return `## ${highlight.replace("\n", ": ")}\n`;
		}
		if (note.trim() === "###") {
			return `### ${highlight.replace("\n", ": ")}\n`;
		}
		return `> [!notes] ${indexCount}
${highlight.split("\n").map(t=>`> ${t}`).join("\n")}
> ***
${note.split("\n").map(t=>`> ${t}`).join("\n")}
`;
	} else {
		highlight = utilsFunctions.cleanText(highlight);
		note = utilsFunctions.cleanText(note);
		return `- ${(utilsFunctions.RGBAToEmoji(utilsFunctions.integerToRGBA(annotation.signedColor)))} ${highlight} (Location ${annotation.location} on [[${(utilsFunctions.unixTimestampToDate(annotation.unixTimestamp))}]]) ${note}`;
	}
}
