FROM ubuntu:18.04

RUN useradd -m user
RUN mkdir /vuln
COPY vuln /vuln/
WORKDIR /vuln

EXPOSE 1337

CMD ["bash","/vuln/run.sh"]
