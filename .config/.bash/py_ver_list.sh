#! /bin/sh

LISTING=`echo $PATH | sed s/:/\ /g`

find $LISTING -type f -executable -iname 'python*' -exec file -i '{}' \; | awk -F: '/charset=binary/ { print $1 }' | xargs -I % sh -c 'echo -n "%: "; % --version'
