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

export function unixTimestampToDate(unixTimestamp: number): string {
	let date = new Date(Number(unixTimestamp));
	return date.toISOString().substring(0, 10);
}

export function RGBAToEmoji(rgba: string): string {
	if (rgba.startsWith("FF0000")) { // Red
		return "❗";
	} else if (rgba.startsWith("00FFFF")) { // Cyan
		return "🧠🔑💡💬";
	} else if (rgba.startsWith("FFFF00")) { // Yellow
		return "";
	} else if (rgba.startsWith("FF00FF")) { // Magenta
		return "✨";
	} else if (rgba.startsWith("00FF00")) { // Green
		return "✅🗺️👤📅";
	}
	return "❓"; // Unknown
}

export function cleanText(text: string): string {
	text = text.replaceAll("\n", " ");
	text = text.replaceAll("`", "");
	return text;
}