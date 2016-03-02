---
title: Efficient Network Access to SquashFS Archives
date: 2010-04-11 13:41:00
categories: sharing squashfs network
tags: linux archival network-filesystem
layout: post
---



Today's wonderful Linux utilities: SquashFS, NFS, and automount.

If you use Linux, you probably know about tarballs: archived collections of files, usually compressed using Gzip or Bzip2. SquashFS takes those to the next level.

The highlights for SquashFS:

- Threaded, so it can take advantage of modern multi-processor hardware.
- Duplicate file detection, optimizing net compression.
- Replicates all filesystem metadata (by default)
- Mountable archives, so they can integrate directly into your filesystem
- NFS-exportable. (Oh, and NFS rocks too!)

In combination with NFS and automount, SquashFS just makes my day.

I archive all kinds of stuff, and SquashFS generates near-optimal results, ensuring that the result consumes the minimum space on disc. (The result is read-only, mind you, but that's great for backups.)

With NFS and automount, I can list specific directories in my automount pool, over the network (NFS), and the archives are automatically visible.

Some configuration samples...

```
# /etc/auto.squashfs.loop
* -fstype=squashfs,ro,loop :/srv/autofs/&.squashfs

# /etc/auto.master
/media/loop/sq /etc/auto.squashfs.loop --timeout=30 --ghost

# /etc/exports
/media *.local(rw,async,crossmnt,no_subtree_check)
```

The result: from other workstations:

```
mount storage:/media /mnt/storage
ls /mnt/storage/loop/sq/archive  # >> directory listing within the archive.squashfs 
```


When I want to add a new directory, I just drop it in /srv/autofs on my storage machine - et voila, everyone in my network can peer into it, while disc consumption remains minimum.

Linux making my day as usual...
