# Colors for Man Pages

# Man pages by default use less for displaying. All that needs to be 
# done is to export bold and underline values of termcap. 

# https://linuxtidbits.wordpress.com/2009/03/23/less-colors-for-man-pages/

# NOTE: does not use terminal color variables defined in .bashrc

export LESS_TERMCAP_mb=$'\E[01;31m'       # begin blinking
export LESS_TERMCAP_md=$'\E[01;38;5;74m'  # begin bold
export LESS_TERMCAP_me=$'\E[0m'           # end mode
export LESS_TERMCAP_se=$'\E[0m'           # end standout-mode
export LESS_TERMCAP_so=$'\E[38;5;246m'    # begin standout-mode - info box
export LESS_TERMCAP_ue=$'\E[0m'           # end underline
export LESS_TERMCAP_us=$'\E[04;38;5;146m' # begin underline
