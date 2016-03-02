---
title: Paranoid Filesystem Access over SSH
date: 2011-05-04 19:02:00
tags: ssh security
categories: linux network security
layout: post
---



In some of my work projects, it's necessary to grant filesystem access to our clients and contractors, so they can upload and manipulate data on our servers.

I'm paranoid. The systems I manage are a tight ship - if you want on the ship, you will conform to our security requirements. Resistance is futile.

OpenSSH offers a handful of very useful features in this regard. The following configuration provides some nice features:
Users in the sftp group are chroot-ed into their home directories
Users in the rsync group can run rsync only within their home directories.
Multiple users in a client's organization can share a home directory
I can switch a user from sftp-mode to rsync-mode by changing their groups.

- [Relevant parts of SSH config](http://pastebin.com/SUQFLVmH)
- [Rsync shell wrapper](http://pastebin.com/HGSfn18H)

User setup in this environment is slightly trickier, so I've scripted it... highlights:

```shell
mkdir -p /path/to/$GROUP/.ssh
touch /path/to/$GROUP/.ssh/authorized_keys.$USER
groupadd -f $GROUP
chgrp $GROUP /path/to/$GROUP/
useradd -g users -G sftp -d /path/to/$GROUP/ -s /bin/bash -c $realname $USER
chown $USER:root /path/to/$GROUP/.ssh/authorized_keys.$USER
chmod 0444 /path/to/$GROUP/.ssh/authorized_keys.$USER
```

Some blanks to fill in there for your SSH public keys, etc. Use group 'rsync' to switch to rsync-mode, rather than 'sftp'.

So now external users can push data to us, edit files we're hosting for them, etc... and I can still sleep at night, paranoia and sanity still intact.
