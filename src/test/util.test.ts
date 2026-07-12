import {expect, test} from "@jest/globals";
import {number} from "./json/howtotakenotes-success/util.integerToRGBA.input-2022-11-19 14-04-29.json"
import {convertedRGBA} from "./json/howtotakenotes-success/util.integerToRGBA.output-2022-11-19 14-04-29.json";
import {integerToRGBA, formatHighlight} from "../util";

test("util.integerToRGBA", () => {
	expect(integerToRGBA(number)).toEqual(convertedRGBA);
})

// Signed colour integers taken from real Moon Reader exports (Book Exports/*.mrexpt).
const fmt = (signedColor: number) => formatHighlight(integerToRGBA(signedColor), "TEXT");

test("formatHighlight maps real Moon Reader colours to one unambiguous marker", () => {
	expect(fmt(2013265664)).toEqual("TEXT");        // #FFFF00 yellow  -> general (no marker)
	expect(fmt(1962868736)).toEqual("❗ TEXT");      // #FF0000 red     -> super-important
	expect(fmt(-2013200385)).toEqual("💬 TEXT");     // #00FFFF cyan    -> quote
	expect(fmt(-1224690176)).toEqual("[[TEXT]]");    // #00B600 green   -> concept/entity wikilink
	expect(fmt(-11184811)).toEqual("❓ TEXT");        // #555555 grey    -> unknown
});
