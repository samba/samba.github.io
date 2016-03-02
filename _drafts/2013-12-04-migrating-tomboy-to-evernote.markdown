---
title: Migrating Tomboy to Evernote
tags: workflow
date: 2013-12-04 09:08:00
categories: system migration
layout: post
---


So I'm finally converting my old Tomboy note archives to Evernote.

I discovered I had installed Tomboy on this Mac when I first started using it, attempting to carry over my previous workflow on Linux. (Sadly Tomboy on Mac just isn't as fluid and usable as Evernote, not even close.)

Since I still need some of those notes available for reference, I've written a conversion tool in Python to translate Tomboy's ".note" files to an Evernote-compatible ".enex" export archive.

I've posted [the project here][1]. Credit for format reference and inspiration documented there.

It's structured to provide a foundation for other (similar) conversion processes as migrating between note-taking tools evolves. If you've got another conversion process in mind that would seem to be compatible, feel free to contribute improvements. :)

Hope it helps, if you find yourself needing to migrate!


[1]: https://github.com/samba/trombone
