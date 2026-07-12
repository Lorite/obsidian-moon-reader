// import {logArgs} from "./devutils";

export function integerToRGBA(number: number): string {
	if (number < 0) {
		number = 0xFFFFFFFF + number + 1;
	}
	const ARGB = number.toString(16).toUpperCase();

	const output = `${ARGB.slice(2,)}${ARGB.slice(0, 2)}`;
	// eslint-disable-next-line prefer-rest-params
	// logArgs(arguments, output);
	return output;
}

export function unixTimestampToDate(unixTimestamp: number | string): string {
	let date = new Date(Number(unixTimestamp));
	if (isNaN(date.getTime())) { // guard malformed timestamps so one bad record can't crash the export
		return "";
	}
	return date.toISOString().substring(0, 10);
}

// Formats a highlight according to the Moon Reader colour it was made with.
// One colour = one unambiguous marker, so no manual pruning is ever needed:
//   Red     — super-important        -> "❗ text"
//   Cyan    — quote (a.k.a. "blue")  -> "💬 text"
//   Yellow  — general highlight       -> "text" (no marker)
//   Magenta — vocabulary              -> "✨ text"
//   Green   — concept / key term / fact / place / person / date -> "[[text]]" (wikilink)
// The `rgba` argument is the string from integerToRGBA (RRGGBBAA); we match on
// the RGB prefix so the alpha (opacity) the reader adds is ignored.
export function formatHighlight(rgba: string, text: string): string {
	if (rgba.startsWith("FF0000")) { // Red — super-important
		return `❗ ${text}`;
	} else if (rgba.startsWith("00FFFF")) { // Cyan ("blue") — quote
		return `💬 ${text}`;
	} else if (rgba.startsWith("FFFF00")) { // Yellow — general highlight (no marker)
		return text;
	} else if (rgba.startsWith("FF00FF")) { // Magenta — vocabulary
		return `✨ ${text}`;
	} else if (rgba.startsWith("00FF00") || rgba.startsWith("00B600")) { // Green — concept/entity -> wikilink
		return `[[${text}]]`;
	}
	return `❓ ${text}`; // Unknown colour
}

export function cleanText(text: string): string {
	text = text.replaceAll("\n", " ");
	text = text.replaceAll("`", "");
	return text;
}