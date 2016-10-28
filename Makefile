DIR=$(PWD)
DATE:=$(shell date +%Y-%m-%d)

# Which Pygments stylesheet to adapt?
HIGHLIGHT_STYLE:=github

.PHONY:  docker-setup docker-run deploy cleanslate

all:  serve

_sass/code.scss:
	vagrant ssh -c "cd /vagrant; bundle exec rougify style $(HIGHLIGHT_STYLE)" > $@


deploy: compile-javascript
	git commit -a && git push github

clean remove-site:
	vagrant ssh -c "cd /vagrant; bundle exec jekyll clean"

newsite:
	@echo "THIS IS DANGEROUS." >&2
	vagrant ssh -c "cd /vagrant; bundle install && bundle exec jekyll new . --force"

.vagrant/up: Vagrantfile Gemfile Makefile
	test -f .vagrant/up && $(MAKE) .vagrant/down
	vagrant plugin list | grep vbguest || vagrant plugin install vagrant-vbguest
	vagrant up --provision
	vagrant ssh -c "cd /vagrant; bundle install"
	touch -r $< $@

.vagrant/down:
	vagrant halt
	rm .vagrant/up

serve: _sass/code.scss _config.yml .vagrant/up
	@echo "Starting Jekyll in Vagrant; to enable drafts, run as 'DRAFT=1 make $@'"
ifeq ($(DRAFT), 1)
	$(eval DRAFT := --drafts --unpublished)
else
	$(eval DRAFT := )
endif
	vagrant ssh -c "cd /vagrant; bundle exec jekyll serve $(DRAFT) --watch --force_polling --incremental --host=0.0.0.0 "


newpost:
	sh scripts/newpost.sh

compile-javascript:
	npm run compile
