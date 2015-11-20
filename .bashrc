#! /bin/bash

# ~/.bashrc
# fmc (franklin.chou@yahoo.com)
# last modified: 15 Nov 2015
#

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

# [forked from https://github.com/joeledwards/bashrc/blob/master/bashrc]

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
export HISTIGNORE="history:ls"


# aliases
alias ls='ls --color=auto -a --group-directories-first'
alias dir='ls --color=auto'
alias grep='grep --color=auto'
alias screen='screen -c /home/fmc/.config/screen/.screenrc'

# PS1='[\u@\h \W]\$ '	# default

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

PS1="\
\[$status$Color_Off\]\
\[ [$user_color\]\u\
\[$Color_Off\]@\
\[$host_color\]\h\
\[$Color_Off\] ]\
\[ $path_color\]\W\
\[$Color_Off\] > "

# lists available python versions
echo -e "$BPurple""Listing available Python versions:$Color_Off"
~/.config/.bash/py_ver_list.bsh
echo ""

# lists outstanding dev tasks
if [[ -s "tasks.txt" ]]; then
    echo -e "$BCyan""Outstanding development tasks:$Color_Off"
    n=1
    while read p; do
        echo $n" "$p
        n=$(( n+1 ))
    done <tasks.txt
    echo ""
else
    return
fi 

# changes directory to home
cd ~
