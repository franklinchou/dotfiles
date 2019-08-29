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

" Install vim plug if missing
if empty(glob('~/.local/share/nvim/site/autoload/plug.vim'))
  silent !curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $HOME/.config/nvim/init.vim
endif

" uncomment for use in vim
" call plug#begin('~/.vim/plugged')

" From the documentation:
"   If you omit the path argument to `plug#begin()`, plugins are installed in
"   runtimepath at the point when `plug#begin()` is called. This is usually
"   `plugged` directory under the first path in `runtimepath` at the point when
"   `~/.vim/plugged` (or `$HOME/vimfiles/plugged` on Windows) given that you didn't
"   `plug#begin()` is called.
call plug#begin('~/.local/share/nvim/plugged')

Plug 'vim-airline/vim-airline'
Plug 'airblade/vim-gitgutter'
Plug 'tpope/vim-fugitive'

" Initialize plugin system
call plug#end()

"---------------

" auto format when writing in go
" files won't immediately refresh; to refresh, issue `:e`
au BufWritePost *.go !gofmt -w %


autocmd FileType javascript
    \ setlocal autoindent |
    \ setlocal shiftwidth=2 |
    \ setlocal expandtab |
    \ setlocal tabstop=2 |
    \ setlocal softabstop=2

