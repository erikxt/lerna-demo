import { readdirSync, statSync, readFileSync, createWriteStream } from "fs";
import JSZip from "jszip";
import { readFile } from 'fs/promises';
const config = JSON.parse(
    await readFile('./package.json')
);
var zip = new JSZip();
let output = config.name + ".zip";

var zipDirFiles = function readDir(obj, nowPath) {
    var files = readdirSync(nowPath);
    files.forEach(function (fileName, index) {
        let filePath = nowPath + "/" + fileName;
        let file = statSync(filePath);
        if (file.isDirectory()) {
            let dirList = obj.folder(fileName);
            readDir(dirList, filePath);
        } else {
            obj.file(fileName, readFileSync(filePath));
        }
    })
}

var addToZip = function (path) {
    return new Promise((resolve, reject) => {
        let stat = statSync(path);
        if (stat.isDirectory()) {
            zipDirFiles(zip.folder(path), path);
        } else {
            zip.file(path, readFileSync(path, { 'encoding': 'utf8' }));
        }
        resolve(path);
    });
}

taskList = [
    addToZip("nginx.conf"),
    addToZip("build"),
    addToZip("node_modules")
]
console.log(taskList)
Promise.allSettled(taskList).then((results) => {
    results.forEach((result) => console.log(result.status));
    console.log("start zip")
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: "DEFLATE", compressionOptions: { level: 5 } })
        .pipe(createWriteStream(output))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log(config.name, ".zip written.");
        });
}).catch(err => {
    console.log(err);
});