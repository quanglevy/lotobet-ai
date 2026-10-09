const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /<button[\s\S]*?LÀM MỚI\s*<\/button>\s*<button[\s\S]*?CẬP NHẬT KẾT QUẢ\s*<\/button>/;

if (regex.test(content)) {
    const matched = content.match(regex)[0];
    content = content.replace(regex, `<>${matched}</>`);
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log("Successfully wrapped buttons in fragment.");
} else {
    console.log("Regex not found.");
}
