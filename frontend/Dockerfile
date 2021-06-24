FROM node:12 as base
ARG BUILD_VERSION=development
ARG REACT_APP_VERSION_NO=0-localBuild
ARG REACT_APP_VERSION=0.0
COPY . /app
WORKDIR /app
RUN npm install
RUN REACT_APP_VERSION_NO=$REACT_APP_VERSION_NO REACT_APP_VERSION=$REACT_APP_VERSION REACT_APP_BUILD_VERSION=$BUILD_VERSION npm run build

# The Base Image used to create this Image
FROM httpd:latest

# Just my name who wrote this file
MAINTAINER NorbertSuchojad (norbert.suchojad@gmail.com)

# to Copy a file named httpd.conf from present working directory to the /usr/local/apache2/conf inside the container
# I have taken the Standard httpd.conf file and enabled the necassary modules and adding Support for an additional Directory
COPY ./docker/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=base /app/build/ /usr/local/apache2/ppong

# This is the Additional Directory where we are going to keep our Virtualhost configuraiton files
# You can use the image to create N number of different virtual hosts
RUN mkdir -p /usr/local/apache2/conf/sites/
COPY ./docker/sites/default.conf /usr/local/apache2/conf/sites/

# To tell docker to expose this port
EXPOSE 80
EXPOSE 443
