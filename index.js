var Happner = require('happner');
var Config  = require('./config');

Happner.create(Config)
.then(function(mesh) {
console.log('mesh created successfully :');
});

console.log("hello world");
