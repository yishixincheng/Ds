// JavaScript Document
// compile.js

var traceur = require('traceur');
var fs = require('fs');
var path = require('path');
var PATH_SOURCE = '/home/king/box-fork/dist';
var PATH_TARGET = '/home/king/box-fork-compile';

function readSync(paths, i, f) {
    if (i >= 0 && i < paths.length) {
        var stats = fs.statSync(paths[i]);
        if (stats.isFile()) {
            f('file', paths[i]);
            return readSync(paths, ++i, f);
        } else if (stats.isDirectory()) {
            var newPaths = fs.readdirSync(paths[i]).map(function (pathname) {
                return path.join(paths[i], pathname);
            });
            f('directory', paths[i]);
            return readSync(paths.slice(0, i).concat(newPaths, 
                                                     paths.slice(i + 1)), 
                            i, f);
        } else {
            return readSync(paths.slice(0, i).concat(paths.slice(i + 1)), 
                            i, f);
        }
    } else {
        return paths;
    }
}

readSync([PATH_SOURCE], 0, function (type, pathname) {
    var newPath = path.join(PATH_TARGET, pathname.replace(new RegExp('^' + source.replace(/\//g,'\/').replace(/\\/g,'\\')), ''));
    if (type === 'file') {
        if (path.extname(pathname) !== '.js') {
            console.log('copy %s %s', pathname, newPath);
            fs.writeFileSync(newPath, fs.readFileSync(pathname));
            return;
        }

        console.log('traceur %s %s', pathname, newPath);
        var src = fs.readFileSync(pathname, {encoding:'utf8'});
        var options = {};
        var compiled = traceur.compile(src, options);

        fs.writeFileSync(newPath, compiled, {encoding:'utf8'});
    } 
    if (type === 'directory') {
        console.log('mkdir %s', newPath);
        fs.mkdirSync(newPath);
    }
});