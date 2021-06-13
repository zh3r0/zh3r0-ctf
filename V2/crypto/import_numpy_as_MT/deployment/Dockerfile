FROM ubuntu:20.04
RUN apt-get -q -y update && \
    apt-get -q -y install \
    python3-dev \
    xinetd
RUN apt-get -q -y install python-crypto python3-pip
RUN pip3 install pycryptodome

COPY ./ctf.xinetd /etc/xinetd.d/ctf
RUN echo "Blocked by ctf_xinetd" > /etc/banner_fail

COPY files .

CMD ["xinetd", "-dontfork"]

EXPOSE 1337
