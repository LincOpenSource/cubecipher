# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/vagrant", disabled:true

    config.vm.define "dev", primary: true do |dev|
    dev.vm.synced_folder ".", "/vagrant", type: "rsync",
      rsync__exclude: [".git/","node_modules/"],
      rsync__args: ["--verbose", "--rsync-path='sudo rsync'"]
    dev.vm.synced_folder "./spec", "/vagrant/spec"
    dev.vm.synced_folder "./rel", "/vagrant/rel"
    dev.vm.synced_folder "./lib", "/vagrant/lib"
    dev.vm.synced_folder "./browser", "/vagrant/browser"
    dev.vm.synced_folder "./codo", "/vagrant/codo"
  end
end
