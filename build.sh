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

echo "###"
echo "# Running \"grunt build\" for building server application"
echo "###"
if cd "$SAL_SERVER_DIR";
then
    grunt build --gruntfile "Gruntfile.js"
else
    echo "Could not change to directory $SAL_SERVER_DIR. Unalbe to build server application."
    exit 1
fi

echo "###"
echo "# Running \"ember build --environment=development\" for building client application"
echo "###"
if cd "$SAL_CLIENT_DIR";
then
    ember build --environment=development --output-path "$SAL_CLIENT_BUILD_DIR"
else
    echo "Could not change to directory $SAL_CLIENT_DIR. Unalbe to build client application."
    exit 1
fi

echo "###"
echo "# Preparing archive file of application"
echo "###"
if cd "$PROJECT_DIR";
then
    BASE_FILE_NAME="build_"$(date +%F)
    FILE_EXT="tar.gz"
    FILE_INDEX=1
    # Determine a valid file name to avoid overwrite
    FILE_NAME=$BASE_FILE_NAME
    while [ -e "$FILE_NAME"."$FILE_EXT" ]
    do
        FILE_NAME="$BASE_FILE_NAME"_$FILE_INDEX
        # Increment file index
        ((FILE_INDEX=FILE_INDEX+1))
    done
    # Set the final file name
    FILE=$FILE_NAME.$FILE_EXT
    echo "# Creating archive \"$FILE\" of application"
    tar -czf $FILE --exclude="node_modules/" --exclude=".DS_Store" build
    echo "# Archive was created successfully."
else
    echo "Could not change to directory $PROJECT_DIR."
    exit 1
fi

echo "###"
echo "# Transfering \"$FILE\" to uberspace host $UBERSPACE_HOST."
echo "###"
if [ -e "$FILE" ];
then
    scp -i ~/.ssh/uberspace_rsa $FILE dora@"$UBERSPACE_HOST":"$DEST_DIR"
    echo "# Transfer of $FILE to directory $DEST_DIR completed."
else
    echo "File $FILE does not exists. Unable to transfer file."
    exit 1
fi