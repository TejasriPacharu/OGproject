#!/bin/bash
set -e

TIME_LIMIT=5

# Run Python safely
timeout ${TIME_LIMIT}s python3 solution.py < input.txt > output.txt
