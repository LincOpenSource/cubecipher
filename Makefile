
ICED=node_modules/.bin/iced
RSP2JSON=node_modules/.bin/rsp2json
BROWSERIFY=node_modules/.bin/browserify
BUILD_STAMP=build-stamp
UGLIFYJS=node_modules/.bin/uglifyjs
WD=`pwd`

BROWSER=browser/cubecipher.js

default: build
all: build

lib/%.js: src/%.iced
	$(ICED) -I browserify -c -o lib $<

$(BUILD_STAMP): \
	lib/main.js \
	lib/wordarray.js \
	lib/algbase.js \
	lib/sha512.js \
	lib/util.js \
	lib/hmac.js \
	lib/aes.js \
	lib/twofish.js \
	lib/ctr.js \
	lib/salsa20.js \
	lib/pbkdf2.js \
	lib/enc.js \
	lib/dec.js \
	lib/prng.js \
	lib/drbg.js \
	lib/sha3.js \
	lib/combine.js \
	lib/sha256.js \
	lib/sha224.js \
	lib/sha384.js \
	lib/sha1.js \
	lib/scrypt.js \
	lib/md5.js \
	lib/ripemd160.js
	date > $@

$(BROWSER): lib/main.js $(BUILD_STAMP)
	$(BROWSERIFY) -s cubecipher $< > $@

build: $(BUILD_STAMP) $(BROWSER)

spec/cubecipher_v1.json: ref/gen_cubecipher_spec.iced
	$(ICED) $< -v 1 > $@
spec/pbkdf2_sha512_sha3.json: ref/gen_pbkdf2_sha512_sha3_spec.iced
	$(ICED) $< $ > $@
spec/scrypt_xor.json: ref/gen_scrypt_xor_spec.iced
	$(ICED) $< $ > $@

release: browser/cubecipher.js
	V=`jsonpipe < package.json | grep version | awk '{ print $$2 }' | sed -e s/\"//g` ; \
	cp $< rel/cubecipher-$$V.js ; \
	$(UGLIFYJS) -c < rel/cubecipher-$$V.js > rel/cubecipher-$$V-min.js 

spec: spec/cubecipher.json spec/pbkdf2_sha512_sha3.json

clean:
	rm -f lib/*.js $(BUILD_STAMP) $(TEST_STAMP)

doc:
	node_modules/.bin/codo

setup:
	npm install -d

.PHONY: clean setup test test-browser-buffer doc spec

