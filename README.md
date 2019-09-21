# Netlify-LuaLaTeX

Automatically install texlive and run lualatex to generate PDF files. The installation is cached in Netlify build environments.

## Installation

Add netlify-lualatex to your project by executing `npm install netlify-lualatex`.

## Usage

The following is a simple example for how to use the module:

```js
import compile from 'netlify-lualatex';
import path from 'path'

const texSource = `
\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
    This is a test.
    \\[
        x+1>y^2
    \\]
\\end{document}
`;

compile(path.resolve('./output.pdf'), texSource).then(() => {
    console.log('Compiled successfully!');
});
```

## License

The MIT license.