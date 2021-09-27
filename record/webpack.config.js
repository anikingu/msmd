var fs = require('fs');
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
    externals: {
        ...nodeModules,
        
    }
};
