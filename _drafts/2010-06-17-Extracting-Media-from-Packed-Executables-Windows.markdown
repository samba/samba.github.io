---
title: Extracting Media from Packed Executables in Windows
date: 2010-06-17 22:01:00
tags: windows obfuscation
categories: windows packed executables
layout: post
---

I don't often blog about Windows stuff. I try to avoid Windows. This is an exception.

Some time ago I received a slideshow in an EXE. It was meant for previewing images before printing. Since then I've occasionally wanted digital copies of the images in it, but never had the time/patience to dig into it.

Tonight I found the gusto and made it happen. Here's how...

Try opening the file in 7-zip or Resource Hacker. If both complain, it's probably packed.

Determine the packing method used on the EXE. A common packing method is UPX, which has a free tool to pack/unpack the data.

Mine was packed using aspack. I discovered this by peering through the binary data of it. (Not for the weak of heart.) A quick way to check this: on a Linux machine, 'grep aspack yourfile.exe'.

Unpack your file. UPX makes it easy, as stated. For me, I found a tool called 'aspackdie' (version 1.3d) which seemed to like the file. It reported that the file was packed using ASPack 2.12, and reported that it appended "extra data" at address 046DD740h - to a destination file, unpacked.ExE.

I then opened it in WinHex, moved to that address (measured from the end of the file!), and specified that ending section of the file as a "block". I instructed WinHex to look for audio and photo files in various formats, within that range, and to look at every byte in the file.

About 10 minutes later, I had 1200+ photos waiting for me to inspect... which I promptly archived, along with the original presentation, to a CD.

