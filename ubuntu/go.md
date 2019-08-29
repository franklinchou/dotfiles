# Setting up golang

* [How to install go](https://www.linode.com/docs/development/go/install-go-on-ubuntu/)
* Set `GOPATH` and `GOROOT` manually. Issue:
  * `export GOPATH=$HOME/Documents/dev/go` This is where go anticipates go project source code to be stored
  * `export GOROOT=/usr/local/go/bin` This is the directory containing the go executable
* Finally, set `PATH` to pick up `GOROOT`, `export PATH=$PATH:$GOROOT`

  Alternatively these can be set in `~/.config/.env` where all other environment variables in Franklin \*nix distributions are stored. **DON'T** store these variables in `~/.profile` (as the article suggests); it breaks convention!
