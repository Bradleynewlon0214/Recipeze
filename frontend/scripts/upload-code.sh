#!/bin/bash
set -e
# SERVER="68.183.128.101"
echo -e "Copying files to development server..."

if [[ -z "$SERVER" ]]
then
    echo -e "Server IP expected!"
    exit 1
fi

echo -e  "Removing old build directory..."
rm -rf deploy
echo -e "Creating new build directory..."
npm run build
echo -e "Done building!"

echo -e "Uploading build directory to server..."
ssh root@$SERVER "rm -rf /root/build/"
scp -r build root@$SERVER:/root/
echo -e "Uploaded build directory successfully!"

ssh root@$SERVER /bin/bash << EOF
    set -e
    find /root/build/ -type f -print0 | xargs -0 dos2unix
EOF