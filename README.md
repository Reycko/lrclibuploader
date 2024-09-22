# LRCLibUploader

> [!IMPORTANT]
> This project will not be updated frequently, unless the LRCLib API changes or the program breaks.

Easily upload lyrics to LRCLib.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

1. Install [Node.js](https://nodejs.org/en). Make sure to tick [NPM](https://www.npmjs.com/) in the installer.
> This app is always tested under the latest LTS version of node.js.

2. Download either a release of the source code, or from the releases page.
> Downloading straight from source code might cause issues due to unfinished code. Using the latest release for general use is heavily recommended.

3. Extract the release to a folder.

4. Open a terminal (cmd or PowerShell on Windows) and navigate to your folder ([Windows Guide](https://www.digitalcitizen.life/command-prompt-how-use-basic-commands/)).

5. Enter the command `npm ci`. This will download packages into the `node_modules` folder.

6. Follow how-to.

7. Either:
  a. Run `npm run build`, then `npm run start`
  b. Run `npm run test`. This might be slower.

## Basic how-to:

1. All the files have to be put in the `data` folder. Create it.  

2. Make a file named "data.json".  

- Here is the structure (straight from the source code):

```ts
trackName: string;
artistName: string;
albumName?: string;
duration: number;
```

>`string` means text, in quotes. If your data contains a quote, escape it with a backslash (`\`)
example: `"\"quoted text\""`  
The question mark (`?`) on `albumName` means optional. If you don't provide it, it'll be empty.  
[JSON Documentation (MDN)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)  
Example key: `"trackName": "My \"Track \""`

3. Put your plain-text lyrics into a file named "plain.txt".  

4. Put your synced lyrics into a file named "synced.txt".  

## FAQ

> Why is this so complicated to set up as a non-developer?

This project was not originally meant to be uploaded, but was cleaned up for this purpose. Ease of use has not been touched yet.

tl;dr: Ease of use is not the current focus.

> Why does it say i have 1 plain lyric on my synced lyrics that isn't supposed to be there, but I have verified and there are none?

Printing which lines (line number + content) cause the issue is planned. You might have trailing newlines. Make sure to time-code them if you want to put empty sections in songs.

tl;dr: Check start and end for trailing newlines, time-code empty sections.