FROM ruby:2.3

WORKDIR /root

RUN apt-get update && apt-get upgrade -y


# This provides Jekyll, Kramdown, etc as dependencies.
RUN ruby -S gem install github-pages
RUN ruby -S gem install therubyracer
RUN mkdir /opt/bin

COPY scripts/*.sh /opt/bin/
RUN chmod +x /opt/bin/*.sh

CMD DRAFT="${DRAFT}" /opt/bin/serve.sh


EXPOSE 4000