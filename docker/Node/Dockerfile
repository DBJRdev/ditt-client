FROM            node:latest

RUN             mkdir /home/docker-container-user \
                && mkdir /workspace \
                && useradd -d /home/docker-container-user -s /bin/bash docker-container-user

COPY            ./init-container.sh /root/init-container.sh

WORKDIR         /workspace
