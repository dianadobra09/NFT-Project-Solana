#!/bin/sh

sudo docker-compose down
sudo docker image prune -f
sudo docker-compose build --no-cache
sudo docker-compose up -d
sudo docker-compose up -d