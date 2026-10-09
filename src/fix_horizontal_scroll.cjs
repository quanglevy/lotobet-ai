const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.page-content \{\s*flex: 1;\s*overflow-y: auto;/g, '.page-content {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: auto;');

fs.writeFileSync('src/index.css', css, 'utf8');
