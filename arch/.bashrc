#! /bin/bash

# ~/.bashrc
# fmc (franklin.chou@yahoo.com)
# last modified: 25 Jan 2015
#

# use 256 color
export TERM=xterm-256color

#------------------------------------------------------------------------------
#
# COLORS:
# Bold can be triggered by pre-pending B; underline, by prepending U
# Eight colors are available via standard BASH prompt:
#
# Black
# Red
# Green
# Yellow
# Blue
# Purple
# Cyan
# White
#
#------------------------------------------------------------------------------

# from https://github.com/joeledwards/bashrc/blob/master/bashrc

# Reset color
Color_Off='\e[0m'       # Text Reset

# Regular Colors
Black='\e[0;30m'        # Black
Red='\e[0;31m'          # Red
Green='\e[0;32m'        # Green
Yellow='\e[0;33m'       # Yellow
Blue='\e[0;34m'         # Blue
Purple='\e[0;35m'       # Purple
Cyan='\e[0;36m'         # Cyan
White='\e[0;37m'        # White

# Bold
BBlack='\e[1;30m'       # Black
BRed='\e[1;31m'         # Red
BGreen='\e[1;32m'       # Green
BYellow='\e[1;33m'      # Yellow
BBlue='\e[1;34m'        # Blue
BPurple='\e[1;35m'      # Purple
BCyan='\e[1;36m'        # Cyan
BWhite='\e[1;37m'       # White

# Underline
UBlack='\e[4;30m'       # Black
URed='\e[4;31m'         # Red
UGreen='\e[4;32m'       # Green
UYellow='\e[4;33m'      # Yellow
UBlue='\e[4;34m'        # Blue
UPurple='\e[4;35m'      # Purple
UCyan='\e[4;36m'        # Cyan
UWhite='\e[4;37m'       # White

#------------------------------------------------------------------------------

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# history
export HISTCONTROL=ignoreboth:erasedups
export HISTIGNORE="history:ls:clear"

#------------------------------------------------------------------------------
# check if there are downloading torrents
#------------------------------------------------------------------------------
function __torrent {
    transmission-remote -l | grep -o '[0-9]\{1,\}%' | while read line; do
        if [ "${line%?}" -ne 100 ]; then
            transmission-remote --start
            break
        fi
    done
    return
}

# aliases
alias dir='ls --color=auto'
alias grep='grep --color=auto'
alias screen='screen -c /home/fmc/.config/screen/.screenrc'
# alias transmission='__torrent'
alias cls='clear'
alias path='echo -e ${PATH//:/\\n}'

# colorizes; adds BASH command, green N for nominal, yellow W for all errors/warnings
status_nominal=$Green
status_warning=$BYellow

status=""
if [[ $? != 0 ]]; then
    status="$status_warning""W"
else
    status="$status_nominal""N"
fi

user_color=$Blue
host_color=$UBlack  # Black not visible in terminal
path_color=$BBlue


# Removed status indicator; prepend to restore:
# \[$status$Color_Off\]\

PS1="\
\[[$user_color\]\u\
\[$Color_Off\]@\
\[$host_color\]\h\
\[$Color_Off\] ]\
\[ $path_color\]\W\
\[$Color_Off\] > "

#------------------------------------------------------------------------------
# Functions
#------------------------------------------------------------------------------

# lists available python versions
function __py_ver_list {
    echo -e "$BPurple""Listing available Python versions:$Color_Off"
    ~/.config/.bash/py_ver_list.sh
    echo ""
    return
}

ls() {
    if [ "${PWD}" = "/home/fmc" ]; then
        command ls --color=auto --group-directories-first "$@"
        return
    fi
    command ls -a --color=auto --group-directories-first "$@"
}

#------------------------------------------------------------------------------
# execute functions
#------------------------------------------------------------------------------
__py_ver_list

#------------------------------------------------------------------------------
# source external scripts
#------------------------------------------------------------------------------
source ~/.config/.bash/colorize_man_pages.sh

# changes initial working directory
cd ~/dev/minilabs
