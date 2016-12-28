(function() { // begin enclosed

  var bitcore = require('bitcore-lib')
    , bitcore_ecies = require('bitcore-ecies')
    , crypto = require('crypto-browserify')
    , BigInteger = require('bigi')
    , AESLib = require('aes')
    , Buffer = require('buffer').Buffer
    , uuid = require('node-uuid')
  ;

  var browser = false;

  var clone = function(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  var convert = function(val, inputEncoding, outputEncoding){
    return new Buffer(val, inputEncoding).toString(outputEncoding);
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') browser = true;

  // allow require when module is defined (needed for NW.js)
  if (typeof module !== 'undefined') module.exports = Crypto;
  if (browser) window.Crypto = Crypto;

  function Crypto(opts) {

    if (!opts)
      opts = {};

    this.keyPairToWIF = function(keyPair){
      return new bitcore.PrivateKey(keyPair.privateKey).toWIF();
    }

    this.keyPairFromWIF = function(wif){

      var privateKey = bitcore.PrivateKey.fromWIF(wif);

      return {
        privateKey: Buffer(privateKey.toString(), 'hex').toString('base64'),
        publicKey: Buffer(privateKey.publicKey.toString(), 'hex').toString('base64'),
      };
    }

    this.symmetricEncrypt = function(data, key, algorithm){
      if (!algorithm) algorithm = 'aes-256-ctr';

      var cipher = crypto.createCipher(algorithm, key);
      return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

    };

    this.symmetricDecrypt = function(encrypted, key, algorithm){

      if (!algorithm) algorithm = 'aes-256-ctr';

      var decipher = crypto.createDecipher(algorithm, key);
      return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

    };

    this.symmetricEncryptObject = function(obj, key, algorithm){
      return this.symmetricEncrypt(JSON.stringify(obj), key, algorithm);
    };

    this.symmetricDecryptObject = function(encrypted, key, algorithm){
      return JSON.parse(this.symmetricDecrypt(encrypted, key, algorithm));
    };

    this.asymmetricEncrypt = function(publicKey, privateKey, message){

      if (!Buffer.isBuffer(message)){
        message = new Buffer(message);
      }

      if (typeof privateKey == 'string')
        privateKey = new bitcore.PrivateKey(Buffer(privateKey, 'base64').toString('hex'));

      if (typeof publicKey == 'string')
        publicKey = new bitcore.PublicKey(Buffer(publicKey, 'base64').toString('hex'));

      return bitcore_ecies()
        .privateKey(privateKey)
        .publicKey(publicKey)
        .encrypt(message);

      if (typeof privateKey == 'string')
          privateKey = new bitcore.PrivateKey(Buffer(privateKey, 'base64').toString('hex'));

      if (typeof publicKey == 'string')
        publicKey = new bitcore.PublicKey(Buffer(publicKey, 'base64').toString('hex'));

      return bitcore_ecies()
        .privateKey(privateKey)
        .publicKey(publicKey)
        .decrypt(message);

    };

    this.asymmetricDecrypt = function(publicKey, privateKey, message){

      if (!Buffer.isBuffer(message)){
        message = new Buffer(message);
      }

      if (typeof privateKey == 'string')
          privateKey = new bitcore.PrivateKey(Buffer(privateKey, 'base64').toString('hex'));

      if (typeof publicKey == 'string')
        publicKey = new bitcore.PublicKey(Buffer(publicKey, 'base64').toString('hex'));

      return bitcore_ecies()
        .privateKey(privateKey)
        .publicKey(publicKey)
        .decrypt(message);

    };

    this.sign = function(hash, privateKey, hashEncoding) {
      if (!hashEncoding)
        hashEncoding = 'base64';

      if (typeof hash == 'string')
        hash = new Buffer(hash, hashEncoding);

      if (typeof privateKey == 'string')
        privateKey = bitcore.PrivateKey(Buffer(privateKey, 'base64').toString('hex'));

      return bitcore.crypto.ECDSA.sign(hash, privateKey).toBuffer().toString('base64');
    };

    this.verify = function(hash, signature, publicKey, hashEncoding) {
      if (!hashEncoding)
        hashEncoding = 'base64';

      if (typeof hash == 'string')
        hash = new Buffer(hash, hashEncoding);

      if (typeof publicKey == 'string')
        publicKey = bitcore.PublicKey(Buffer(publicKey, 'base64').toString('hex'));

      if (typeof signature == 'string') {
        signature = bitcore.crypto.Signature.fromBuffer(Buffer(signature, hashEncoding));
      }

       return bitcore.crypto.ECDSA.verify(hash, signature, publicKey);
    };

    this.validatePublicKey = function(publicKey, encoding){
      try{

        var keyToCheck = publicKey.toString();

        if (encoding == 'base64')
          keyToCheck = convert(publicKey, 'base64', 'hex');

        return bitcore.PublicKey.isValid(keyToCheck);

      }catch(e){
        return false;
      }

    };

    this.validatePrivateKey = function(privateKey, encoding){
      try{

        var keyToCheck = privateKey.toString();

        if (encoding == 'base64')
          keyToCheck = convert(privateKey, 'base64', 'hex');

        return bitcore.PrivateKey.isValid(keyToCheck);

      }catch(e){
        return false;
      }
    };

    this.createKeyPair = function(){
      var keyPair = new bitcore.PrivateKey();
      return {
        privateKey: Buffer(keyPair.toString(), 'hex').toString('base64'),
        publicKey: Buffer(keyPair.publicKey.toString(), 'hex').toString('base64'),
      };
    };

    this.createHashFromString = function(input, outputEncoding, algorithm) {

      if (!outputEncoding)
        outputEncoding = 'base64';

      if (!algorithm)
        algorithm = 'sha256';

      var shasum = crypto.createHash(algorithm);

      return shasum.update(input).digest(outputEncoding);
    };

    this.generateNonce = function(randomValue) {

      if (!randomValue) randomValue = uuid.v4().toString() + uuid.v4().toString();

      return this.createHashFromString(randomValue);
    };

    this.attacheMiddleware = function(app, route){

      var fs = require('fs');

      if (!route) route = '/happn_util_crypto'

      app.use(route, function(req, res, next){

        res.setHeader("Content-Type", "application/javascript");

        if (this.cached)
          return res.end(this.cached);

        var path = require('path');
        var _this = this;

        fs.readFile(path.resolve(__dirname, '../build/lib/crypto.js'), function(e, buf) {
          _this.cached = buf.toString();
          res.end(_this.cached);
        });

      });

    }

  };

})(); // end enclosed
