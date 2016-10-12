
$provision_script =  <<SCRIPT
    export DEBIAN_FRONTEND=noninteractive
    sudo -E apt-get update
    sudo -E apt-get -y install ruby2.1 ruby ruby2.1-dev ruby-dev bundler rubygems-integration zlib1g-dev nodejs
SCRIPT

 # which gem && sudo -E gem install github-pages therubyracer --no-ri --no-rdoc

Vagrant.configure("2") do |config|

  # use Debian Jessie
  config.vm.box = "debian/jessie64"
  config.vm.box_check_update = true
  config.vm.provider "virtualbox"
  config.ssh.forward_agent = true

  # Enable the site to serve on `localhost:4000` on the host.
  config.vm.network "forwarded_port", guest: 4000, host: 4000
  config.vm.network "private_network", type: "dhcp"

  # Install Ruby, etc
  config.vm.provision :shell, inline: $provision_script

  # To override the default rsync behavior, this allows Jekyll to poll for file
  # changes and re-compile the site on file save.
  config.vm.synced_folder "./", "/vagrant", id: "vagrant-root",
      owner: "vagrant",
      group: "www-data",
      mount_options: ["dmode=775,fmode=664"],
      type: ""

end