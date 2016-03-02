---
title: Preparing an ISO of OS X Mavericks
date: 2013-11-22 22:59:00
tags: maintenance operating-system
categories: mac system maintenance
layout: post
---


This guy, "CrEOF", [posted a VERY useful script][1] to create an ISO image of OS X Mavericks (10.9). You can find it there ([at that link][1]), but I'm copying it here for posterity's sake as well. (It's quite solid, I literally copy-and-pasted it. Thanks CrEOF!!)

(begin copy...)

> I've found a number of websites with instructions on creating a bootable USB for installing
> Mavericks, but an ISO is much more useful in my ESXi environment. Of course there's a 101+ 
> ways to do this, the only requirement for this solution is a command line. You'll of 
> course need to adjust the paths if necessary/desired.


```shell
# Mount the installer image
hdiutil attach /Applications/Install\ OS\ X\ Mavericks.app/Contents/SharedSupport/InstallESD.dmg -noverify -nobrowse -mountpoint /Volumes/install_app

# Convert the boot image to a sparse bundle
hdiutil convert /Volumes/install_app/BaseSystem.dmg -format UDSP -o /tmp/Mavericks

# Increase the sparse bundle capacity to accommodate the packages
hdiutil resize -size 8g /tmp/Mavericks.sparseimage

# Mount the sparse bundle for package addition
hdiutil attach /tmp/Mavericks.sparseimage -noverify -nobrowse -mountpoint /Volumes/install_build

# Remove Package link and replace with actual files
rm /Volumes/install_build/System/Installation/Packages
cp -rp /Volumes/install_app/Packages /Volumes/install_build/System/Installation/

# Unmount the installer image
hdiutil detach /Volumes/install_app

# Unmount the sparse bundle
hdiutil detach /Volumes/install_build

# Resize the partition in the sparse bundle to remove any free space
hdiutil resize -size `hdiutil resize -limits /tmp/Mavericks.sparseimage | tail -n 1 | awk '{ print $1 }'`b /tmp/Mavericks.sparseimage

# Convert the sparse bundle to ISO/CD master
hdiutil convert /tmp/Mavericks.sparseimage -format UDTO -o /tmp/Mavericks

# Remove the sparse bundle
rm /tmp/Mavericks.sparseimage

# Rename the ISO and move it to the desktop
mv /tmp/Mavericks.cdr ~/Desktop/Mavericks.iso

```



> I take no responsibility if it blows up your machine (or worse yet installs Windows). 
> The comments and some man'ing should explain it all. Hopefully it'll save someone 
> some time.


[1]: http://forums.appleinsider.com/t/159955/howto-create-bootable-mavericks-iso
