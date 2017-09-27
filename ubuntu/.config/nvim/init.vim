" Franklin Chou
" Neo Vimrc

set number
set relativenumber

set expandtab
set autoindent
set shiftwidth=4
set tabstop=4
set softtabstop=4

set textwidth=0

" always show status bar
set laststatus=2

" set gutter
" set colorcolumn=80
set colorcolumn=120

" kill mouse clicks in vim, b/c isn't that the whole point?
set mouse-=a

" set visible whitespace
set list
set listchars=trail:~,space:·

set ruler
set modeline

"----------------
" Tabs
"----------------
nmap <F7> :tabp<CR>
nmap <F8> :tabn<CR>

"----------------


"----------------
" Manage plugins
"----------------

call plug#begin('~/.vim/plugged')

Plug 'vim-airline/vim-airline'
Plug 'airblade/vim-gitgutter'
Plug 'tpope/vim-fugitive'

" Initialize plugin system
call plug#end()

"---------------

autocmd FileType javascript
    \ setlocal autoindent |
    \ setlocal shiftwidth=2 |
    \ setlocal expandtab |
    \ setlocal tabstop=2 |
    \ setlocal softabstop=2
