const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

// The string might be broken across lines or have different spacing.
// Let's just find the closing brace before from "./utils/statistics"
c = c.replace(/\} from "\.\/utils\/statistics";/, ', predictTXCL, checkTXCL } from "./utils/statistics";');

fs.writeFileSync('src/App.jsx', c, 'utf8');
