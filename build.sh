# Setup path variables for script
PROJECT_DIR="$PWD"
BUILD_DIR="$PROJECT_DIR"/"build"
SAL_CLIENT_DIR="sal_client"
SAL_CLIENT_BUILD_DIR="$BUILD_DIR"/"public"
SAL_SERVER_DIR="sal_server"

UBERSPACE_HOST="elnath.uberspace.de"

echo "Running \"grunt build\" for building server application"
grunt build --gruntfile "$SAL_SERVER_DIR"/"Gruntfile.js"

echo "Running \"ember build --environment=production\" for building client application"
cd "$SAL_CLIENT_DIR"
ember build --environment=production --output-path "$SAL_CLIENT_BUILD_DIR"

echo "Creating Zip archive \"build.zip\" of application"
cd "$PROJECT_DIR"
zip -rq9 build.zip build