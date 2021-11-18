var fs = require('fs');
const path = require('path');
var nodeModules = {}
fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });


module.exports = {
    target: 'node',
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'assets')
        }
    },
    externals: {
        ...nodeModules, 
    }
};
