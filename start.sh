#!/bin/bash

trap 'exit 1' ERR

if ! which docker > /dev/null 2>&1
then
    echo 'Can not find Docker. Make sure it is installed.' >&2
    exit 1
fi

if [ "$1" = "test" ]
then
    # TEST
    tag="test"
    name="bfanodotest"
elif [ "$1" = "latest" ]
then
    # PROD
    tag="latest"
    name="bfanodo"
else
    echo Argument 1 must be either latest or test. >&2
    exit 1
fi

# Run this just a single time.
# Docker itself makes sure it autostarts if it crashes or the server reboots.
docker run                      \
    --detach                    \
    --restart=unless-stopped    \
    --memory 4g                 \
    $mounts                     \
    -p 8545:8545                \
    -p 8546:8546                \
    -p 30303:30303              \
    --name ${name}              \
    bfaar/nodo:${tag}
