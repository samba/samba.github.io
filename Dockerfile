FROM ruby:2.3

WORKDIR /root

RUN apt-get -q update && apt-get -q upgrade -y
RUN apt-get -q install -y vim-nox


# This provides Jekyll, Kramdown, etc as dependencies.
RUN ruby -S gem install github-pages therubyracer
# RUN ruby -S gem install therubyracer
# RUN ruby -S gem install jekyll-assets
RUN mkdir /opt/bin

COPY scripts/*.sh /opt/bin/
COPY Gemfile /tmp/Gemfile
RUN chmod +x /opt/bin/*.sh

RUN bundle install --gemfile=/tmp/Gemfile

CMD DRAFT="${DRAFT}" /opt/bin/serve.sh


EXPOSE 4000