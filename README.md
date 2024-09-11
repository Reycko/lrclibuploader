# LRCLibUploader

> [!IMPORTANT]
> This project will not be updated frequently, unless the LRCLib API changes or the program breaks.

Easily upload lyrics to LRCLib.

[![CC BY 4.0][cc-by-shield]][cc-by]

**Basic how-to:**

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
Example key: {"trackName": "My \\"Track \\""}  

3. Put your plain-text lyrics into  a file named "plain.txt".  

4. Put your synced lyrics into a file named "synced.txt".  

<br>

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg