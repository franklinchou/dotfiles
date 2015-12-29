"
" vimrc
" fmc (franklin.chou@yahoo.com)
" Last Modified: 28 DEC 2015
"

" SET FEEDBACK {{{

set novisualbell
set errorbells

" }}}

" PACKAGE MGMT {{{

" issue `:PlugInstall` to update
call plug#begin()
Plug 'tbastos/vim-lua'
" Plug 'ervandew/supertab'
Plug 'sjl/gundo.vim'
Plug 'tpope/vim-fugitive'
Plug 'ternjs/tern_for_vim'
Plug 'valloric/YouCompleteMe'
Plug 'itchyny/lightline.vim'
" Plug 'scrooloose/nerdtree'
Plug 'ap/vim-buftabline'
Plug 'morhetz/gruvbox'
call plug#end()

" }}}

" BASIC GUI SETTINGS {{{

" set encoding=utf-8
set cursorline
set nocompatible
set number
set colorcolumn=80

" alternate colors:
highlight colorcolumn ctermbg=gray
highlight LineNr ctermbg=gray ctermfg=black
highlight CursorLineNr cterm=bold ctermbg=gray ctermfg=blue

" show edit marks
set list
set listchars=trail:~,space:·

" select theme
if &term == "xterm-256color"
    set t_Co=256
    colorscheme gruvbox
    set background=dark
endif

" set clipboard across multiple instances of vim
set clipboard=unnamed

" }}}

" LIGHTLINE SETTINGS {{{

" display lightline
set laststatus=2
" set showtabline=2

" remove extraneous information provided by the default vim statusline
" now covered by lightline
set noshowmode

let g:lightline = {
    \ 'enable': {
        \ 'tabline': 0,
        \ 'statusline': 1
    \ },
    \ 'colorscheme': 'gruvbox'
    \ }

" }}}

" BUFTABLINE SETTINGS {{{

let g:buftabline_show=2
let g:buftabline_numbers=1
let g:buftabline_indicators=1

" }}}

" TABS {{{

" VIM uses the `tabstop` setting to visually display tabs
set tabstop=4

" VIM uses the `softtabstop` setting to set tabstop when EDITING
set softtabstop=4

" displays tab character as spaces
set expandtab

" }}}

" KEY BINDINGS {{{

" map F5 to display gundo interface
nnoremap <F5> :GundoToggle<CR>

" }}}
