#! /bin/bash

# fmc (frnaklin.chou@yahoo.com)
# 22 Nov 2015

# bulk copy specified files and directories
# locations listed in file INPUT, with syntax:
# [copy from]:[copy to]

# there are lots of stupid hacks here because BASH variables do no support
# filename expansion, namely:
# (1) use full file paths, `~` does not expand;
# (2) when copying a directory omit the final "/*" indicator

INPUT='./.locations'

function copy {
    if [[ -s "$INPUT" ]]; then
        while IFS='' read -r line || [[ -n "$line" ]]; do

            local copy_from="${line%%:*}"
            local copy_to="${line##*:}"

            local is_dir="${copy_from##*/}"

            if [[ "$is_dir" = "*" ]]; then
                cp -r "$copy_from""/*" "$copy_to"
            else
                cp "$copy_from" "$copy_to"
            fi
        done < "$INPUT"
    fi

    return
}

copy
