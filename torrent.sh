#! /bin/bash

# function to start transmission daemon
# franklin chou (franklin.chou@yahoo.com)
# 21 Nov. 2015

#------------------------------------------------------------------------------
# check if there are downloading torrents

function __torrent {
    transmission-remote -l | grep -o '[0-9]\{1,\}%' | while read line; do
        if [ "${line%?}" -ne 100 ]; then
            transmission-daemon start
            break
        fi
    done

    return
}

#------------------------------------------------------------------------------

__torrent
