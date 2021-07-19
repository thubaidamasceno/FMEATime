var spawn = require('child_process').spawn;
const chokidar = require("chokidar");
var bat;

function roda() {
    // execSync("node ./app.js",{stdio: 'inherit',encoding: 'utf-8'});
    console.log('inicia spawn');
    bat = spawn('node', ['./app.js']);
    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    bat.stderr.on('data', (data) => {
        console.error(data.toString());
    });
    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        switch (code) {
            case 0:
                watcher.close();
            default:
                roda();
        }
    });
}

function reload() {
    if (bat) {
        console.log("killing");
        bat.kill();
    }
}

console.log("iniciando watcher...");
const watcher = chokidar.watch("./**/*", {
    ignored:  ['**/node_modules/**/*', '**/.git/**/*'],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    followSymlinks: true,
    persistent:true,
    interval: 1000,
    binaryInterval: 1000,
});
watcher.on("ready", function () {
    watcher.on("all", function () {
        console.log("alterado...");
        reload();
    });
});

//
roda();