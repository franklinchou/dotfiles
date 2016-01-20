"
" vimrc
" fmc (franklin.chou@yahoo.com)
" Last Modified: 17 Jan 2015
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

if &term == "xterm-256color"
    " select theme
    set t_Co=256
    colorscheme gruvbox
    set background=dark

    " set highlighting color for misspelled words
endif

" set clipboard across multiple instances of vim
set clipboard=unnamed

" If we're dealing w/an HTML or CSS file, set tab indent to TWO spaces
autocmd FileType css
    \ setlocal tabstop=2 |
    \ setlocal softtabstop=2

autocmd FileType html
    \ setlocal tabstop=2 |
    \ setlocal softtabstop=2

" }}}

" NON-CODING IN VIM {{{

" Settings to use when editing markdown text
autocmd BufRead,BufNewFile *.md
    \ setlocal textwidth=80 |
    \ setlocal formatoptions=t1 |
    \ setlocal spell spelllang=en_us

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

" set code folding
inoremap <F9> <C-O>za
nnoremap <F9> za
onoremap <F9> <C-C>za
vnoremap <F9> zf

" }}}
