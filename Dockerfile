FROM alpine:3.7
ENV HUGO_VERSION 0.73.0
ENV HUGO_BINARY hugo_${HUGO_VERSION}_linux-64bit
RUN apk update && apk add py-pygments && apk add bash && rm -rf /var/cache/apk/*
RUN apk add --no-cache \
		bash \
		build-base \
		ca-certificates \
		curl \
		git \
		libcurl
RUN mkdir /usr/local/hugo
ADD https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}.tar.gz /usr/local/hugo/
RUN tar xzf /usr/local/hugo/${HUGO_BINARY}.tar.gz -C /usr/local/hugo/ \
	&& ln -s /usr/local/hugo/hugo /usr/local/bin/hugo \
	&& rm /usr/local/hugo/${HUGO_BINARY}.tar.gz

RUN mkdir /app
WORKDIR /app
COPY startup.sh /app/startup.sh
COPY themes /app/themes
COPY resources /app/resources
RUN chmod -R 777 /app
RUN chmod -R 777 /app/themes/*
RUN chmod +x startup.sh
EXPOSE 1313
CMD ["sh","startup.sh"]
