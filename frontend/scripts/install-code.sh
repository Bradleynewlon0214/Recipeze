#!/bin/bash
set -e
# SERVER="68.183.128.101"
echo -e "Installing project on server..."

if [[ -z "$SERVER" ]]
then
    echo -e "Server IP expected!"
    exit 1
fi


ssh root@$SERVER /bin/bash << EOF
    echo -e "Shutting down nginx..."
    systemctl stop nginx
    echo -e "Shutting down pm2..."
    pm2 stop static-page-server-8080

    echo -e "Copying build to /app/ directory..."
    cp -r build /app/

    echo "Starting pm2..."
    pm2 start static-page-server-8080
    echo "Starting nginx..."
    systemctl start nginx

EOF

echo -e "Project installed successfully!"



# Installing Node:

# curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
# apt-get install -y nodejs
# apt-get install -y build-essential

# Node Installs:
# npm i -g pm2
# npm i -g serve

# To start server:
# npm rum build
# pm2 serve build #server will be running on port 8080
# pm2 stop static-page-server-8080

# Installing nginx:
# apt-get install nginx
# ufw allow "Nginx HTTP"
