#!/bin/sh


cd /root

case "${DRAFT:-nodraft}" in
	"draft") use_drafts="--drafts";;
	*) use_drafts="#nodraft";;
esac

set -x
bundle exec jekyll serve --host=0.0.0.0 --watch --force_polling ${use_drafts}
set +x