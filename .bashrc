#
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

# manual package management
~/.bash-git-prompt/gitprompt.sh

# changes directory to home
cd ~

