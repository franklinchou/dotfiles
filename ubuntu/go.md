# Setting up golang

Go is installed in two places:

* `/usr/bin/go`
* `/usr/lib/go`

If go is already installed remove the existing installation. (Or rename as `go-old`.)

Download go:

```
sudo curl -O https://storage.googleapis.com/golang/go1.9.1.linux-amd64.tar.gz`
```

This example installs `1.9.1`, substitute for the needed version.

Extract the file with `tar`

```
tar -xvf go1.9.1.linux-amd64.tar.gz
```

Copy the following:

From | To
--- | ---
`go/bin/go` | `/usr/bin/go`
`go` | `/usr/lib/go`

```
sudo cp ./go/bin/go /usr/bin/go
sudo cp ./go /usr/bin/go
```
