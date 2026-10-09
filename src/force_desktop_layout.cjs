const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// The block to remove:
// @media (max-width: 1024px) {
//   .dashboard-layout {
//     flex-direction: column;
//   }
//   .dashboard-col-main, .dashboard-col-side {
//     width: 100%;
//     align-items: flex-start;
//     margin-top: 1rem;
//   }
// }

css = css.replace(/@media \(max-width: 1024px\) \{\s*\.dashboard-layout \{\s*flex-direction: column;\s*\}\s*\.dashboard-col-main, \.dashboard-col-side \{\s*width: 100%;\s*align-items: flex-start;\s*margin-top: 1rem;\s*\}\s*\}/g, '');

// Also remove the header stacking I added
// @media (max-width: 768px) {
//   .header-row {
//     flex-direction: column;
//     align-items: stretch;
//   }
// }

css = css.replace(/@media \(max-width: 768px\) \{\s*\.header-row \{\s*flex-direction: column;\s*align-items: stretch;\s*\}\s*\}/g, '');

// We should also make sure the page-content or dashboard-layout allows horizontal scrolling if it overflows on mobile
css = css.replace(/\.dashboard-layout \{/, '.dashboard-layout {\n  min-width: 1000px; /* Force desktop width on mobile */');

fs.writeFileSync('src/index.css', css, 'utf8');
console.log("Removed responsive stacking");
