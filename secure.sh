#CREATING CERTIFICATE
if [$1]
    DOMAIN_FILE = $1
    cd /etc/nginx/sites-enabled
    touch ${DOMAIN_FILE}.conf
else
    echo "SPECIFY DOMAIN"
fi