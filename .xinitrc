#!/bin/sh

# ordinarily resides in /home/$USER

userresources=$HOME/.Xresources
usermodmap=$HOME/.Xmodmap
sysresources=/etc/X11/xinit/.Xresources
sysmodmap=/etc/X11/xinit/.Xmodmap

# merge in defaults and keymaps

if [ -f $sysresources ]; then
    xrdb -merge $sysresources
fi

if [ -f $sysmodmap ]; then
    xmodmap $sysmodmap
fi

if [ -f "$userresources" ]; then
    xrdb -merge "$userresources"
fi

if [ -f "$usermodmap" ]; then
    xmodmap "$usermodmap"
fi

# start some nice programs

if [ -d /etc/X11/xinit/xinitrc.d ] ; then
    for f in /etc/X11/xinit/xinitrc.d/?*.sh ; do
        [ -x "$f" ] && . "$f"
    done
    unset f
fi

# set beep volume
amixer set 'Beep' 1%

# disable touchpad
declare -i TOUCHPAD_ID
TOUCHPAD_ID=`xinput list | grep -Eio 'touchpad\s*id\=[0-9]{1,2}' | grep -Eio '[0-9]{1,2}'`
xinput disable $TOUCHPAD_ID

exec awesome

# composite manager
# exec xcompmgr -c &
