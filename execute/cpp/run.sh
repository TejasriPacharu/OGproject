#!/bin/bash
set -e

# Expected files inside /app
# solution.cpp
# input.txt
# output.txt (generated)

TIME_LIMIT=5

# Compile
g++ solution.cpp -O2 -o solution

# Run with strict timeout
timeout ${TIME_LIMIT}s ./solution < input.txt > output.txt
