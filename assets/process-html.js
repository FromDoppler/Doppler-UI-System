var { exec } = require('child_process');
var path = require('path');

var glob = require('glob');
var env = process.argv.slice(2)[0];

glob('./assets/templates/*.html', '', function (er, files) {
    files.forEach(function(file){
    exec(`npm run html-processor ${file} -- --output ./${env}/${path.basename(file)} -e ${env}`, (err, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        return;
      });
    });
});
