#CREATING CERTIFICATE
if [$1]
    DOMAIN = $1
    cd /etc/nginx/sites-enabled
    touch ${DOMAIN}.conf
    echo "server {
            server_name ${DOMAIN};
            # The internal IP of the VM that hosts your Apache config
            set $upstream 127.0.0.1:1337;
            location / {
                proxy_pass_header Authorization;
                proxy_pass http://$upstream;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Connection “”;
                proxy_buffering off;
                client_max_body_size 0;
                proxy_read_timeout 36000s;
                proxy_redirect off;
            }
            listen 80;
        }" > ${DOMAIN}.conf
        
        systemctl reload nginx
        certbot — nginx -d ${DOMAIN}
else
    echo "SPECIFY DOMAIN"
fi