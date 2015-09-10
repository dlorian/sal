# Setup path variables for script
PROJECT_DIR="$PWD"

# Build directory
BUILD_DIR="$PROJECT_DIR"/"build"

# Directory of the client application
SAL_CLIENT_DIR="$PROJECT_DIR"/"sal_client"
SAL_CLIENT_BUILD_DIR="$BUILD_DIR"/"public"

# Directory of the server application
SAL_SERVER_DIR="$PROJECT_DIR"/"sal_server"

# Params for file transfer
UBERSPACE_HOST="elnath.uberspace.de"
DEST_DIR="dev"

# Archive properties
FILE_NAME="build"
FILE_EXT="tar.gz"

echo .
echo "###"
echo "# Running \"grunt build\" for building server application."
if cd "$SAL_SERVER_DIR";
then
    grunt build --gruntfile "Gruntfile.js"
else
    echo "Could not change to directory $SAL_SERVER_DIR. Unable to build server application."
    exit 1
fi
echo "###"
echo .

echo .
echo "###"
echo "# Running \"ember build --environment=development\" for building client application."
if cd "$SAL_CLIENT_DIR";
then
    ember build --environment=development --output-path "$SAL_CLIENT_BUILD_DIR"
else
    echo "Could not change to directory $SAL_CLIENT_DIR. Unable to build client application."
    exit 1
fi
echo "###"
echo .

echo .
echo "###"
echo "# Preparing archive file of application."
FILE=$FILE_NAME.$FILE_EXT
if cd "$PROJECT_DIR";
then
    echo "# Creating archive \"$FILE\" of application."
    tar -czf $FILE --exclude="node_modules/" --exclude=".DS_Store" build
    echo "# Archive was created successfully."
else
    echo "Could not change to directory $PROJECT_DIR."
    exit 1
fi
echo "###"
echo .

echo .
echo "###"
echo "# Transfering \"$FILE\" to uberspace host $UBERSPACE_HOST."
if [ -e "$FILE" ];
then
    echo "# Transfering file $FILE to directory $DEST_DIR."
    scp -i ~/.ssh/id_rsa $FILE dora@"$UBERSPACE_HOST":"$DEST_DIR"
    echo "# Transfer of file $FILE to directory $DEST_DIR completed."

    echo "# Deleting file $FILE."
    rm $FILE
    echo "# File $FILE deleted."
else
    echo "File $FILE does not exists. Unable to transfer file."
    exit 1
fi
echo "###"
echo .