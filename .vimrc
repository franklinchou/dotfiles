"
" vimrc
" fmc (franklin.chou@yahoo.com)
" Last Modified: 15 Oct 2015
"

" {{{ BASIC GUI SETTINGS

set number
set cursorline
set nocompatible
set colorcolumn=80 
set laststatus=2
highlight colorcolumn ctermbg=gray
highlight LineNr ctermbg=gray ctermfg=black 
highlight CursorLineNr cterm=bold ctermbg=gray ctermfg=blue

" }}}

" {{{ PACKAGE MGMT

" call :PlugInstall to update
call plug#begin()
Plug 'tbastos/vim-lua'
" Plug 'ervandew/supertab'
Plug 'sjl/gundo.vim'
Plug 'tpope/vim-fugitive'
Plug 'ternjs/tern_for_vim'
Plug 'valloric/YouCompleteMe'
Plug 'bling/vim-airline'
call plug#end()

" }}}

" {{{ TABS

" VIM uses the `tabstop` setting to visually display tabs 
set tabstop=4

" VIM uses the `softtabstop` setting to set tabstop when EDITING
set softtabstop=4 

" displays tab character as spaces
set expandtab

" }}}

" {{{ KEY BINDINGS

" map F5 to display gundo interface
nnoremap <F5> :GundoToggle<CR>

" }}}
