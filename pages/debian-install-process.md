# Installing a Debian NAS via netinst


1. Prepare a boot device, a USB stick, by cloning its ISO image directly onto the USB stick. Easiest when done using another linux box, `dd if=image.iso of=/dev/sdc` or whatever the device name is.
2. Prepare a second boot device, another USB stick, that provides a FAT32 filesystem, with a directory named `firmware`.
3. Download the [firmware archive](https://wiki.debian.org/Firmware#Location_of_the_firmwares) and extract its content into this `firmware` directory.


