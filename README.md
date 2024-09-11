# LRCLibUploader

Easily upload lyrics to LRCLib.

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
