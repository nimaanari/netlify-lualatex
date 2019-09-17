import compile from './index'
import path from 'path'

const texSource = `
\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
    Hello there. This is some test.
    \\[
        x^2+1=\\int_0^\\infty y\\cdot dy
    \\]
\\end{document}`;

compile(texSource, path.resolve('some.pdf')).then(() => {
    console.log('Compiled successfully!');
});