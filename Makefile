DIR=$(PWD)
DATE:=$(shell date +%Y-%m-%d)
TIME:=$(shell date +%H:%M:%S)
DRAFT?=0
TITLE?=

# this is necessary for subst below...
COMMA := ,
SPACE :=
SPACE +=

# Which Pygments stylesheet to adapt?
HIGHLIGHT_STYLE:=github

DOCKER_IMAGE?=$(notdir $(PWD)):local
DOCKER_IMAGE_FILE?=$(subst :,_,$(subst :,_,$(DOCKER_IMAGE)))
DOCKER_NAME?=samba_github_pages
DOCKER_PORT?=4001
DOCKERFILE_PATH=util/Dockerfile
CACHE?=./cache
GEMFILES:=$(shell ls -1 Gemfile*)
FILEMOUNT:=$(PWD):/srv/jekyll:rw

JEKYLL_CONFIG:=$(wildcard _config*.yml)
JEKYLL_BUILD_ARGS:=--watch --force_polling --incremental --config $(subst $(SPACE),$(COMMA),$(JEKYLL_CONFIG)) --host=0.0.0.0

# On Mac, special mount features have to be activated for file change events to propagate
ifeq ($(shell uname -s),Darwin)
FILEMOUNT:=$(FILEMOUNT),delegated
endif

# Show draft posts in the blog
ifeq ($(DRAFT),1)
$(eval DRAFT_ARG:="--drafts --unpublished")
else
$(eval DRAFT_ARG:="")
endif


all: serve

.PHONY: clean
clean:
	$(MAKE) docker-stop && sleep 5 && $(MAKE) docker-clean

.PHONY: serve
serve: $(JEKYLL_CONFIG)
	@echo $(notdir $(shell which docker))
ifeq ($(notdir $(shell which docker)),docker)
	$(MAKE) docker-up
else
	jekyll serve $(DRAFT_ARG) $(JEKYLL_BUILD_ARGS) 
endif


.PRECIOUS: DOCKER_ENV.local
DOCKER_ENV.local: DOCKER_ENV
	cp -v $< $@

.PHONY: docker-up
docker-up:  DOCKER_ENV.local | docker-build
	$(MAKE) docker-clean
	docker ps  --format="{{.ID}}" -f "name=$(DOCKER_NAME)" -f "status=running" | grep -q '^[0-9a-f]+$$' || \
		docker run -it --env-file $^ --rm -p $(DOCKER_PORT):4000 --name $(DOCKER_NAME) -v "$(FILEMOUNT)" $(DOCKER_IMAGE) \
			 jekyll serve $(DRAFT_ARG) $(JEKYLL_BUILD_ARGS) --trace

.PHONY: docker-run-test
docker-run-test:  DOCKER_ENV.local
	docker run -it --env-file $^ --rm --name test-$(DOCKER_NAME) -v "$(FILEMOUNT)" $(DOCKER_IMAGE) \
		/bin/bash

$(CACHE):
	mkdir -p $@

.PHONY: docker-build
docker-build: $(CACHE)/$(DOCKER_IMAGE_FILE)
$(CACHE)/$(DOCKER_IMAGE_FILE): $(DOCKERFILE_PATH) $(GEMFILES) | $(CACHE)
	test -f Gemfile.lock || touch Gemfile.lock
	chmod a+w Gemfile.lock
	docker build -t "$(DOCKER_IMAGE)" -f $< .
	touch $@

.PHONY: docker-stop
docker-stop:
	docker ps  --format="{{.ID}}" -f "name=$(DOCKER_NAME)" -f "status=running" | xargs -t docker kill

.PHONY: docker-clean
docker-clean:
	docker ps  --format="{{.ID}}" -f "name=$(DOCKER_NAME)" -f "status=exited" | xargs -t docker rm 



## Generates a new draft post
.PRECIOUS: _drafts/%.md
_drafts/%.md: _template/post.md
	sed -E 's@\$${TITLE}@$(TITLE)@; s@\$${DATE}@$(DATE)@; s@\$${TIME}@$(TIME)@;' $< > $@

.PHONY: newpost
newpost: 
	test -n "$(TITLE)"  # must define TITLE environment
	$(eval SLUG := $(shell echo "$(TITLE)" | tr "[:upper:]" "[:lower:]" | sed -E 's@[^a-z0-9]+@-@g; s@\-$$@@g;'))
	$(MAKE) _drafts/$(DATE)-$(SLUG).md

