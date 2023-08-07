const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function fromDir(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        console.log("No directory found: ", startPath);
        return;
    }

    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            callback(filename);
        }
    }
}

function parseTSFile(filename) {
    const sourceCode = fs.readFileSync(filename, 'utf8');
    const sourceFile = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.Latest, true);
    visitNode(sourceFile);

    function visitNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.VariableDeclaration:
                let functionText = sourceCode.substring(node.pos, node.end);
                console.log(filename + '\n' + functionText + '\n');
                break;
            default:
                ts.forEachChild(node, visitNode);
                break;
        }
    }
}

fromDir('/app', '.tsx', function (filename) {
    console.log('Found .tsx file: ', filename);
    parseTSFile(filename);
});
