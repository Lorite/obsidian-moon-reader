import {expect, test} from "@jest/globals";
import {generateOutput} from "../exporter";
import {
	colorFilter,
	listOfAnnotations,
	mrexptTFile
} from "./json/howtotakenotes-success/exporter.generateOutput.input-2022-11-19 14-04-30.json";
import {Annotation} from "../types";
import {TFile} from "obsidian";

test("exporter.generateOutput", () => {
	const list = Array.from(listOfAnnotations);
	expect(generateOutput(list as Annotation[], mrexptTFile as unknown as TFile, [], colorFilter, false)).toMatchSnapshot();
});

test("exporter new experimental output", () => {
	const list = Array.from(listOfAnnotations);
	expect(generateOutput((list as Annotation[]), ((mrexptTFile as unknown) as TFile), [], colorFilter, true)).toMatchInlineSnapshot(`
"---
path: "Book Exports/Sönke Ahrens - How to Take Smart Notes_ One Simple Technique to Boost Writing,  Learning and Thinking-Sönke Ahrens (2022).mrexpt"
title: "How to Take Smart Notes. One Simple Technique to Boost Writing,  Learning and Thinking"
author: 
lastExportedTimestamp: 1665321164166
lastExportedID: 12623
tags: 
  - "review/book"
---

## Section 5

> [!notes] 12585
> INTRODUCTION
> ***
> 

## Section 6

## 1 Everything You Need to Know

## Section 7

## 2 Everything You Need to Do: 

## Section 8

## 3 Everything You Need to Have

## Section 9

## 4 A Few Things to Keep in Mind

## Section 11

## 5 Writing Is the Only Thing That Matters

## Section 12

## 6 Simplicity Is Paramount

## Section 13

## 7 Nobody Ever Starts From Scratch

## Section 14

## 8 Let the Work Carry You Forward

## Section 16

## 9 Separate and Interlocking Tasks

## Section 17

## 10 Read for Understanding

## Section 18

## 11 Take Smart Notes

## Section 19

## 12 Develop Ideas

## Section 20

## 13 Share Your Insight

## Section 21

## 14 Make It a Habit

## Section 6

### 1.1 Good Solutions are Simple – and Unexpected

### 1.2 The Slip-box

### 1.3 The slip-box manual

"
`);
});
