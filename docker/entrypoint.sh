#!/bin/bash

for SITE in $(ls /etc/nginx/sites/); do
  cat /etc/nginx/sites/${SITE} | sed -e "s/PORT_80/${PORT0}/g" > /etc/nginx/sites-enabled/${SITE} ;
done

/usr/sbin/nginx -c /etc/nginx/nginx.conf
