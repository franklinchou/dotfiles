#! /bin/bash

# ~/.bashrc
# fmc (franklin.chou@yahoo.com)
# last modified: 18 Oct 2015
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto -a'
alias dir='ls --color=auto'
alias screen='screen -c /home/fmc/.config/screen/.screenrc'

# PS1='[\u@\h \W]\$ '	# default
# PS1='[\[\e[0;36m\]\u\[\e[m\]@\[\e[4;30m\]\h\[\e[m\] \W]\[\e[0;30m\] \$ '

# colorizes; adds BASH command, green N for nominal, yellow W for all errors/warnings
PS1="\$(if [[ \$? != 0 ]]; then echo \"\[\e[1;33m\]W\[\e[m\]\"; else echo \"\[\e[0;32m\]N\[\e[m\]\"; fi) [\[\e[1;34m\]\u\[\e[m\]@\[\e[4;30m\]\h\[\e[m\] \[\e[1;34m\]\W\[\e[m\]]\$ "

# lists available python versions (@TODO: list latest python ver?)
echo -e "\e[1;31mListing available Python versions: \e[0;0m"
~/.config/.bash/py_ver_list.bsh
echo ""

# lists outstanding dev tasks
if [ -s tasks.txt ]
then
    echo -e "\e[3;36mOutstanding development tasks: \e[0;0m"
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


