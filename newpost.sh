#!/bin/sh


cleanchars () {
	tr -d '\n' | tr -s ' [:punct:][:blank:][:cntrl:][:space:]' '-'
}

d=$(date +%Y-%m-%d)
title=$(echo "$@" | cleanchars)

p="_posts/$d-$title.textile"
echo $p
touch $p

