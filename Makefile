DIR=$(PWD)
EDITABLE_TYPES='html md css js textile'
DATE:=$(shell date +%Y-%m-%d)

editables: 
	@find $(DIR) $(shell echo $(EDITABLE_TYPES) | sed -r "s/([a-z0-9]*)/-name%%'*.\1'/g; s/ / -o /g; s/%%/ /g;")

revisions: 
	$$EDITOR $$($(MAKE) -s editables)

sanitize:
	tr -d '\n' | tr -s '[:punct:][:blank:][:cntrl:][:space:]' '-'

newpost:
	m=$$(mktemp /tmp/post.XXX); echo -n 'Title: '; read t; \
		echo $$t | $(MAKE) -s sanitize  > $$m; \
		p="_posts/$(DATE)-$$(cat $$m).textile"; \
		echo -e "---\nlayout: default\ntitle: $$t\n---" > $$p; \
		rm $$m; $$EDITOR $$p

deploy:
	git commit -a && git push github
