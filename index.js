var Happner = require('happner');
var Config  = require('./config');

Happner.create(Config)
.then(function(mesh) {
console.log('mesh created successfully : Azure Pipeline');
});

console.log("hello world");
