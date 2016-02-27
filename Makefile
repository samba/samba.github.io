DIR=$(PWD)
EDITABLE_TYPES='html md css js textile'
# EDITOR=$(shell which mvim || which vim)
DATE:=$(shell date +%Y-%m-%d)

# Which rules to evaluate perpetually
AUTOBUILD:=.docker-build


# Which Pygments stylesheet to adapt?
HIGHLIGHT_STYLE:=github


.PHONY:  docker-setup docker-run deploy cleanslate


all:  .docker-build


watch:
	(while true; do make --silent ${AUTOBUILD}; sleep 1; done) | grep -v 'make\[1\]'

stylesheet/code.css:
	docker run -it -v `pwd`:/root samba.github.io  \
		bundle exec rougify style github > $@

deploy:
	git commit -a && git push github


.docker-build: Dockerfile
	docker build -t samba.github.io .
	touch $@


clean cleanslate:
	docker run -it -v `pwd`:/root -p 4000:4000 samba.github.io  \
		bundle exec jekyll clean

docker-setup: .docker-build
	docker run -it -v `pwd`:/root samba.github.io  bundle exec jekyll new . --force

serve docker-run: .docker-build stylesheet/code.css _config.yml
	@echo "To activate draft feature, run with DRAFT=draft;" >&2
	docker run -e DRAFT="${DRAFT}" -it -v `pwd`:/root -p 4000:4000 samba.github.io


docker-shell:
	docker run -it -v `pwd`:/root -p 4000:4000 samba.github.io bash

newpost:
	sh scripts/newpost.sh

