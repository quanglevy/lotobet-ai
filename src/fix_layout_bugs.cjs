const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix the Copy Button stretching
c = c.replace(
    /className="flex items-center gap-1 px-3 py-1 bg-\[#1f2937\] text-gray-300 rounded hover:bg-\[#374151\] transition-colors text-xs border border-gray-700"/g,
    'className="flex items-center gap-1 px-3 py-1 bg-[#1f2937] text-gray-300 rounded hover:bg-[#374151] transition-colors text-xs border border-gray-700 w-fit self-start"'
);

// 2. Fix the layout stacking on standard desktops by lowering breakpoint from xl to lg
c = c.replace(
    /<div className="flex flex-col xl:flex-row justify-between gap-8">/g,
    '<div className="flex flex-col lg:flex-row justify-between gap-4 w-full">'
);

c = c.replace(
    /className="w-full xl:w-\[40%\] flex flex-col gap-6"/g,
    'className="w-full lg:w-[40%] flex flex-col gap-6"'
);

c = c.replace(
    /className="w-full xl:w-\[20%\] flex flex-col items-start xl:items-end mt-8 xl:mt-0"/g,
    'className="w-full lg:w-[20%] flex flex-col items-start lg:items-end mt-8 lg:mt-0"'
);

// 3. Ensure the Header spans correctly and isn't squished
const headerRegex = /<header className="relative flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-3 border-b border-\[#1f2937\] bg-\[#0f1225\] w-full gap-4 md:gap-0">/;
if (headerRegex.test(c)) {
    c = c.replace(headerRegex, '<header className="flex flex-col lg:flex-row justify-between items-center px-6 py-3 border-b border-[#1f2937] bg-[#0f1225] w-full gap-4 lg:gap-0">');
    console.log("Updated header classes");
} else {
    console.log("Could not find header regex");
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
