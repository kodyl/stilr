BIN         = ./node_modules/.bin
PATH       := $(BIN):$(PATH)
LIB         = $(shell find lib -name "*.js")
DIST        = $(patsubst lib/%.js,dist/%.js,$(LIB))

MOCHA_ARGS  = --require mocha-clean \
              --require babel/polyfill

MOCHA_DEV   = $(MOCHA_ARGS) \
              --require lib/__tests__/babelinit \
              ./lib/__tests__/*.test.js

MOCHA_DIST  = $(MOCHA_ARGS) \
              ./dist/__tests__/*.test.js

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	git flow release start $$NEXT_VERSION && \
	make build && \
	npm --no-git-tag-version version $(1) -m 'release %s' && \
	git add . && \
	git commit -m 'make build and release' && \
	git flow release finish -m $$NEXT_VERSION $$NEXT_VERSION
endef

dist: $(DIST)
dist/%.js: lib/%.js
	@mkdir -p $(@D)
	$(BIN)/babel $< -o $@ --stage 0 --optional runtime

clean:
	@rm -rf ./dist

link:
	@npm link

test:
	@echo "\nTesting source files, hang on..."
	@$(BIN)/mocha $(MOCHA_DEV)

test-watch:
	@echo "\nStarting test watcher..."
	@$(BIN)/mocha $(MOCHA_DEV) --watch

test-dist:
	@echo "\nTesting build files, almost there..!"
	@$(BIN)/mocha $(MOCHA_DIST)

build: test clean dist test-dist

build-local: test dist test-dist link

release-patch:
	$(call release,patch)

release-minor:
	$(call release,minor)

release-major:
	$(call release,major)

.PHONY:         \
  build         \
  build-local   \
  install       \
  link          \
  release-major \
  release-minor \
  release-patch \
  test          \
  test-dist     \
  test-watch    \
