import compile from './index'

const texSource = `
\\documentclass{article}
\\usepackage{tikz}
\\usepackage{amsmath}
\\usepackage{cleveref}
\\begin{document}
    Hello there. This is some test. \\cref{eq:test}
    \\begin{equation}\\label{eq:test}
        x^2+1=\\int_0^\\infty y\\cdot dy
    \\end{equation}
\\end{document}`;

// findTexlive().then(result => {
//     console.log(result);
// });
compile(texSource, './public/some.pdf').then(() => {
    console.log('Compiled successfully!');
});