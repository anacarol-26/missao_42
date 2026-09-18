#!/bin/bash
if [ $# -eq 0 ]; then
    echo "No arguments supplied"
else
    [ ! -z "$1" ] && echo "$1"
    [ ! -z "$2" ] && echo "$2"
    [ ! -z "$3" ] && echo "$3"
fi
