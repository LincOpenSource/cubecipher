// Generated by IcedCoffeeScript 1.7.1-g
(function() {
  var ADRBG, DRBG, Lock, WordArray, XOR, hmac, iced, sha3, sha512, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  hmac = require('./hmac');

  XOR = require('./combine').XOR;

  sha512 = require('./sha512');

  sha3 = require('./sha3');

  WordArray = require('./wordarray').WordArray;

  Lock = require('iced-lock').Lock;

  DRBG = (function() {
    function DRBG(entropy, personalization_string, hmac_func) {
      this.hmac = hmac_func || hmac.sign;
      this.security_strength = 256;
      entropy = this.check_entropy(entropy);
      personalization_string || (personalization_string = new WordArray([]));
      this._instantiate(entropy, personalization_string);
    }

    DRBG.prototype.check_entropy = function(entropy, reseed) {
      if (reseed == null) {
        reseed = false;
      }
      if ((entropy.sigBytes * 8 * 2) < ((reseed ? 2 : 3) * this.security_strength)) {
        throw new Error("entropy must be at least " + (1.5 * this.security_strength) + " bits.");
      }
      return entropy;
    };

    DRBG.prototype._hmac = function(key, input) {
      return this.hmac({
        key: key,
        input: input
      });
    };

    DRBG.prototype._update = function(provided_data) {
      var V, V_in;
      V = new WordArray([0], 1);
      if (provided_data != null) {
        V = V.concat(provided_data);
      }
      V_in = this.V.clone().concat(V);
      this.K = this._hmac(this.K, V_in);
      V_in.scrub();
      V.scrub();
      this.V = this._hmac(this.K, this.V);
      if (provided_data != null) {
        V_in = this.V.clone().concat(new WordArray([1 << 24], 1)).concat(provided_data);
        this.K = this._hmac(this.K, V_in);
        V_in.scrub();
        this.V = this._hmac(this.K, this.V);
      }
      return provided_data != null ? provided_data.scrub() : void 0;
    };

    DRBG.prototype._instantiate = function(entropy, personalization_string) {
      var i, n, seed_material;
      seed_material = entropy.concat(personalization_string);
      n = 64;
      this.K = WordArray.from_buffer(new Buffer((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
          _results.push(0);
        }
        return _results;
      })()));
      this.V = WordArray.from_buffer(new Buffer((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
          _results.push(1);
        }
        return _results;
      })()));
      this._update(seed_material);
      entropy.scrub();
      return this.reseed_counter = 1;
    };

    DRBG.prototype.reseed = function(entropy) {
      this._update(this.check_entropy(entropy, true));
      return this.reseed_counter = 1;
    };

    DRBG.prototype.generate = function(num_bytes) {
      var i, tmp, _ref;
      if ((num_bytes * 8) > 7500) {
        throw new Error("generate cannot generate > 7500 bits in 1 call.");
      }
      if (this.reseed_counter >= 10000) {
        throw new Error("Need a reseed!");
      }
      tmp = [];
      i = 0;
      while ((tmp.length === 0) || (tmp.length * tmp[0].length * 4) < num_bytes) {
        this.V = this._hmac(this.K, this.V);
        tmp.push(this.V.words);
      }
      this._update();
      this.reseed_counter += 1;
      return (new WordArray((_ref = []).concat.apply(_ref, tmp))).truncate(num_bytes);
    };

    return DRBG;

  })();

  ADRBG = (function() {
    function ADRBG(gen_seed, hmac) {
      this.gen_seed = gen_seed;
      this.hmac = hmac;
      this.drbg = null;
      this.lock = new Lock();
    }

    ADRBG.prototype.generate = function(n, cb) {
      var ret, seed, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/vagrant/src/drbg.iced",
            funcname: "ADRBG.generate"
          });
          _this.lock.acquire(__iced_deferrals.defer({
            lineno: 148
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            if (_this.drbg == null) {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/vagrant/src/drbg.iced",
                  funcname: "ADRBG.generate"
                });
                _this.gen_seed(256, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return seed = arguments[0];
                    };
                  })(),
                  lineno: 150
                }));
                __iced_deferrals._fulfill();
              })(function() {
                return __iced_k(_this.drbg = new DRBG(seed, null, _this.hmac));
              });
            } else {
              return __iced_k();
            }
          })(function() {
            (function(__iced_k) {
              if (_this.drbg.reseed_counter > 100) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/vagrant/src/drbg.iced",
                    funcname: "ADRBG.generate"
                  });
                  _this.gen_seed(256, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        return seed = arguments[0];
                      };
                    })(),
                    lineno: 153
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  return __iced_k(_this.drbg.reseed(seed));
                });
              } else {
                return __iced_k();
              }
            })(function() {
              ret = _this.drbg.generate(n);
              _this.lock.release();
              return cb(ret);
            });
          });
        };
      })(this));
    };

    return ADRBG;

  })();

  exports.DRBG = DRBG;

  exports.ADRBG = ADRBG;

}).call(this);