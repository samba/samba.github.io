DIR=$(PWD)
EDITABLE_TYPES='html md css js textile'

editables: 
	@find $(DIR) $(shell echo $(EDITABLE_TYPES) | sed -r "s/([a-z0-9]*)/-name%%'*.\1'/g; s/ / -o /g; s/%%/ /g;")

revisions: 
	$$EDITOR $$($(MAKE) -s editables)

