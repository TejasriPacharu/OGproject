FROM ubuntu:22.04

# Prevent interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN useradd -m runner

WORKDIR /app

# Copy main dispatcher script
COPY run.sh /run.sh
RUN chmod +x /run.sh

# Copy language runners
COPY cpp /cpp
COPY python /python

RUN chmod +x /cpp/run.sh /python/run.sh

USER runner

ENTRYPOINT ["/run.sh"]
