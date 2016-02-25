FROM ruby:2.3

WORKDIR /root

RUN apt-get update && apt-get upgrade -y


# This provides Jekyll, Kramdown, etc as dependencies.
RUN ruby -S gem install github-pages
RUN ruby -S gem install therubyracer

CMD bundle exec jekyll serve --host=0.0.0.0 --watch --force_polling


EXPOSE 4000