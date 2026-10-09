const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const missingUtils = `
/* Missing Utility Classes for Layout */
.w-full { width: 100%; }
.w-fit { width: fit-content; }
.self-start { align-self: flex-start; }
.flex-wrap { flex-wrap: wrap; }
.hidden { display: none; }

.dashboard-layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}
.dashboard-col-main {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.dashboard-col-side {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.header-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }
  .dashboard-col-main, .dashboard-col-side {
    width: 100%;
    align-items: flex-start;
    margin-top: 1rem;
  }
}
@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: stretch;
  }
}
`;

if (!css.includes('.dashboard-layout')) {
    css += missingUtils;
    fs.writeFileSync('src/index.css', css, 'utf8');
}

let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

// Replace the layout container
appJsx = appJsx.replace(
    /<div className="flex flex-col md:flex-row justify-between gap-4 w-full">/g, 
    '<div className="dashboard-layout">'
);

// Replace columns
appJsx = appJsx.replace(
    /className="w-full md:w-\[40%\] flex flex-col gap-6"/g, 
    'className="dashboard-col-main"'
);

appJsx = appJsx.replace(
    /className="w-full md:w-\[20%\] flex flex-col items-start md:items-end mt-8 md:mt-0"/g, 
    'className="dashboard-col-side"'
);

// Replace header
appJsx = appJsx.replace(
    /<header className="flex flex-col md:flex-row justify-between items-center px-6 py-3 border-b border-\[#1f2937\] bg-\[#0f1225\] w-full gap-4 md:gap-0">/g,
    '<header className="header-row px-6 py-3 border-b border-[#1f2937] bg-[#0f1225]">'
);

// Fix the header text sizes and alignments to be standard without Tailwind breakpoints
appJsx = appJsx.replace(
    /<div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">/g,
    '<div className="flex flex-wrap items-center gap-3">'
);

appJsx = appJsx.replace(
    /<div className="flex items-center gap-3 md:gap-4">/g,
    '<div className="flex items-center gap-4">'
);

fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
console.log("Fixed Missing Tailwind Classes");
