#!/bin/bash

# Getting CLI Params within a bash script.
# Four Methods Given
# bash bash-cli-params.sh -u uflag -a aflag -f fflag first second third fourth fifth sixth


# Access CLI Params via positional reference $1
echo "first seen: $1";
echo "second seen: $2";
echo "third seen: $3";


# Access CLI Params via flags and getopts
while getopts u:a:f: flag
do
    case "${flag}" in
        u) uflag=${OPTARG};;
        a) aflag=${OPTARG};;
        f) fflag=${OPTARG};;
    esac
done
echo "U Flag: $uflag";
echo "A Flag: $aflag";
echo "F Flag: $fflag";


# Access CLI Params via $@ param array
i=1;
for whatever in "$@" 
do
    echo "thing - $i: $whatever";
    i=$((i + 1));
done


# Access CLI Params via shift function which alters positional refereces $1
a=1;
b=$#; # input size
while [ $a -le $b ] 
do
    echo "thing via shift - $a: $1";
    a=$((a + 1));
    shift 1;
done
