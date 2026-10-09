const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

const errorBoundaryScript = `
<script>
  window.addEventListener('error', function(event) {
    document.body.innerHTML = '<div style="color:red; padding:20px; font-size:20px;">' + 
      '<h1>CRASH REPORT</h1>' + 
      '<p>' + event.message + '</p>' + 
      '<pre>' + event.error.stack + '</pre>' + 
      '</div>';
  });
</script>
`;

if (!indexHtml.includes('CRASH REPORT')) {
    indexHtml = indexHtml.replace('<body>', '<body>\n' + errorBoundaryScript);
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log('Injected global error catcher into index.html');
}
