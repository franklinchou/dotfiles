# Setting up golang

* [How to install go](https://www.linode.com/docs/development/go/install-go-on-ubuntu/)
* Set `GOPATH` and `GOROOT` manually. Issue:
  * `export GOPATH=$HOME/Documents/dev/go` This is where go anticipates go project source code to be stored
  * `export GOROOT=/usr/local/go` This is the location of the go executable
  
  Alternatively these can be set in `~/.config/.env` where all other environment variables in Franklin \*nix distributions are stored.
