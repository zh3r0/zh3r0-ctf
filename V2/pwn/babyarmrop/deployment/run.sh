#!/usr/bin/env bash

socat tcp-listen:1337,fork,reuseaddr exec:"/vuln/qemu-aarch64 -L /vuln -nx /vuln/vuln"
