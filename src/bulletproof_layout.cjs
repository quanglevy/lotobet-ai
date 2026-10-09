const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/className="flex flex-col lg:flex-row justify-between gap-4 w-full"/g, 'className="flex flex-col md:flex-row justify-between gap-4 w-full"');
c = c.replace(/className="w-full lg:w-\[40%\] flex flex-col gap-6"/g, 'className="w-full md:w-[40%] flex flex-col gap-6"');
c = c.replace(/className="w-full lg:w-\[20%\] flex flex-col items-start lg:items-end mt-8 lg:mt-0"/g, 'className="w-full md:w-[20%] flex flex-col items-start md:items-end mt-8 md:mt-0"');

// Fix header justify
c = c.replace(/className="flex flex-col lg:flex-row justify-between items-center px-6 py-3 border-b border-\[#1f2937\] bg-\[#0f1225\] w-full gap-4 lg:gap-0"/g, 'className="flex flex-col md:flex-row justify-between items-center px-6 py-3 border-b border-[#1f2937] bg-[#0f1225] w-full gap-4 md:gap-0"');

// Fix buttons just in case
c = c.replace(/className="flex items-center gap-1 px-3 py-1 bg-\[#1f2937\] text-gray-300 rounded hover:bg-\[#374151\] transition-colors text-xs border border-gray-700 w-fit self-start"/g, 'style={{ width: "fit-content", alignSelf: "flex-start", backgroundColor: "#1f2937", color: "#d1d5db", padding: "0.25rem 0.75rem", borderRadius: "0.25rem", border: "1px solid #374151", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}');


fs.writeFileSync('src/App.jsx', c, 'utf8');
