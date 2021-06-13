FROM ubuntu:20.04

RUN apt-get update && apt-get install -y libreadline-dev python3 libjemalloc2

RUN useradd -d /home/challenge/ -m -p challenge -s /bin/bash challenge
RUN echo "challenge:challenge" | chpasswd

WORKDIR /home/challenge
COPY ./libjemalloc.so.2 .
COPY ./mujs .
COPY ./run.sh .
COPY ./ynetd .
COPY ./start.sh .
COPY ./connect.py .
RUN echo "zh3r0{9107cb3f05e7b5d1c7a149f38c8ff4a0}" > flag_ea9cb51550cf5f04aa29dd5fbf71593a
RUN chown -R root:root /home/challenge

USER challenge
EXPOSE 1337
CMD ./start.sh
