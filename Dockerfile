FROM opinioapp/ember-cli
COPY . /myapp
WORKDIR /myapp
RUN bower install --allow-root && npm install
EXPOSE 4200 49153
