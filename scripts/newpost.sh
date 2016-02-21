#!/bin/sh

DATE=`date +%Y-%m-%d`
TIME=`date +%H:%M:%S`
workdir=`pwd`

slug () {
  tr "[:upper:]" "[:lower:]" | sed -E 's@[^a-z0-9]+@-@g; s@\-$@@g;'
}

target_file () {
  echo "${workdir}/_posts/${DATE}-`slug`.markdown"
}


read -p "Post title: " title

TARGET="`echo "${title}" | target_file`"
echo ${TARGET}

[ -f ${TARGET} ] || cat >${TARGET} <<EOF
---
layout: post
category: null
title: ${title}
date: ${DATE} ${TIME}
---

## ${title}

EOF

