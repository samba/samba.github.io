DIR=$(PWD)
DATE:=$(shell date +%Y-%m-%d)
TIME:=$(shell date +%H:%M:%S)
DRAFT?=0
TITLE?=

# Which Pygments stylesheet to adapt?
HIGHLIGHT_STYLE:=github

DOCKER_IMAGE?=github-pages:local
DOCKER_IMAGE_FILE?=$(subst :,_,$(DOCKER_IMAGE))
DOCKER_NAME?=github_pages
CACHE?=./cache
GEMFILES:=$(shell ls -1 Gemfile*)
FILEMOUNT:=$(PWD):/srv/jekyll:rw

ifeq ($(shell uname -s),Darwin)
FILEMOUNT:=$(FILEMOUNT),delegated
endif

.PHONY:  docker-setup docker-run deploy cleanslate

all:  serve

_sass/code.scss: | docker-build
	docker run -it --rm  $(DOCKER_IMAGE) bundle exec rougify style $(HIGHLIGHT_STYLE) > $@

.PHONY: clean
clean:
	$(MAKE) docker-stop && sleep 5 && $(MAKE) docker-clean

$(CACHE):
	mkdir -p $@

.PHONY: docker-build
docker-build: $(CACHE)/$(DOCKER_IMAGE_FILE)
$(CACHE)/$(DOCKER_IMAGE_FILE): Dockerfile $(GEMFILES) | $(CACHE)
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

.PHONY: docker-up
docker-up:  | docker-build
ifeq ($(DRAFT), 1)
	$(eval DRAFT := --drafts --unpublished)
else
	$(eval DRAFT := )
endif
	$(MAKE) docker-clean
	docker ps  --format="{{.ID}}" -f "name=$(DOCKER_NAME)" -f "status=running" | grep -q '^[0-9a-f]+$$' || \
		docker run -it --rm -p 4000:4000 --name $(DOCKER_NAME) -v "$(FILEMOUNT)" $(DOCKER_IMAGE) \
			bundle exec jekyll serve $(DRAFT) --watch --force_polling --incremental --host=0.0.0.0


serve: _sass/code.scss _config.yml 
	$(MAKE) docker-up

.PRECIOUS: _drafts/%.md
_drafts/%.md: _template/post.md
	sed -E 's@\$${TITLE}@$(TITLE)@; s@\$${DATE}@$(DATE)@; s@\$${TIME}@$(TIME)@;' $< > $@

.PHONY: newpost
newpost: 
	test -n "$(TITLE)"  # must define TITLE environment
	$(eval SLUG := $(shell echo "$(TITLE)" | tr "[:upper:]" "[:lower:]" | sed -E 's@[^a-z0-9]+@-@g; s@\-$$@@g;'))
	$(MAKE) _drafts/$(DATE)-$(SLUG).md


compile-javascript:
	npm run compile
