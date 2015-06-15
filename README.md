# cubecipher

Novel implementation of multiple ciphers to harden security.

## How to install

```sh
npm install cubecipher
```

## How to Use

```javascript
var decrypt, encrypt, key, pt0, pt1, ref;
ref = require('cubecipher'), encrypt = ref.encrypt, decrypt = ref.decrypt;
key = new Buffer('SecretPassword');
pt0 = new Buffer('SecretInformation');
pt1 = new Buffer(pt0);
encrypt({
  key: key,
  data: pt1
}, function(err, ciphertext) {
  console.log('Encrypted Data',ciphertext);
  return decrypt({
    key: key,
    data: ciphertext
  }, function(err, pt2) {
    return console.log("Decrypted Data", pt2);
  });
});
```

### Reuse Derived Keys

If you plan to be encrypting more than once, you can choose to reuse
the derived keys:

```javascript
var Decryptor, Encryptor, dec, enc, key, pt0, pt1, pt2, ref;
ref = require('cubecipher');
Encryptor = ref.Encryptor;
Decryptor = ref.Decryptor;
key = new Buffer('SecretPassword');
enc = new Encryptor({
  key: key
});
dec = new Decryptor({
  key: key
});
pt0 = new Buffer('SecretInformation');
pt1 = new Buffer(pt0);
pt2 = new Buffer(pt0);
enc.run({
  data: pt1
}, function(err, ct1) {
  return enc.run({
    data: pt2
  }, function(err, ct2) {
    return dec.run({
      data: ct1
    }, function(err, pt3) {
      return dec.run({
        data: ct2
      }, function(err, pt4) {
        return console.log('Decrypted Data', pt3, 'and', pt4);
      });
    });
  });
});
```

If you want to resalt derived keys with every encryption, you have an option to
ask for that. Otherwise, salt will be reused to speed up encryption
(and decryption).

```javascript
enc.run({
  data: pt1
}, function(err, ct1) {
  return enc.resalt({}, function() {
    return enc.run({
      data: pt2
    }, function(err, ct2) {});
  });
});
```