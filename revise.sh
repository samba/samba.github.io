#!/bin/sh

types='html md css js'


types=$(echo "$types" | sed -r "s/([a-z0-9]*)/-name%%'*.\1'/g; s/ / -o /g; s/%%/ /g;")

vim $(eval find ./ ${types})
