# Setup path variables for script
PROJECT_DIR="$PWD"

# Build directory
DEPLOY_DIR="$PROJECT_DIR"/"sal"

# Archive properties
BUILD_FILE_NAME="build"
FILE_EXT="tar.gz"
# set the file name of the archive
FILE=$BUILD_FILE_NAME.$FILE_EXT

echo ""
echo "###"
echo "# Stopping service \"sal\""
svc -d ~/service/sal
echo "###"
echo ""

echo ""
echo "###"
echo "# Extrating archive \"$FILE\" of application"
tar -xzf "$FILE"
echo "# Archive extracted."
echo "###"
echo ""

echo ""
echo "###"
echo "# Copying files from extracting archive to \"$DEPLOY_DIR\"."
# copy contents of archive to deployment dir. Overwite existing files
cp -rf $BUILD_FILE_NAME/. $DEPLOY_DIR/
echo "# Files copied."
echo "###"
echo ""

echo ""
echo "###"
echo "# Renaming archive \"$FILE\"."
BASE_FILE_NAME="$BUILD_FILE_NAME"_$(date +%F)
FILE_INDEX=1
# Determine a valid file name to avoid overwrite
FILE_NAME=$BASE_FILE_NAME
while [ -e "$FILE_NAME"."$FILE_EXT" ]
do
    FILE_NAME="$BASE_FILE_NAME"_$FILE_INDEX
    # Increment file index
    ((FILE_INDEX=FILE_INDEX+1))
done
NEW_FILE=$FILE_NAME.$FILE_EXT
# rename archive file
mv $FILE $NEW_FILE
echo "# Archive renamed to $NEW_FILE."
echo "###"
echo ""

echo ""
echo "###"
echo "# Removing build directory \"$BUILD_FILE_NAME\"."
rm -rf $BUILD_FILE_NAME
echo "# Directory removed."
echo "###"
echo ""

echo ""
echo "###"
echo "# Renaming archive \"$FILE\""
if cd "$DEPLOY_DIR";
then
    # use npm to install new dependencies if necessary
    npm install
else
    echo "Could not change to directory $SAL_CLIENT_DIR. Unable to run \"npm install\"."
    exit 1
fi
echo "###"
echo ""

echo ""
echo "###"
echo "# Starting service \"sal\""
svc -u ~/service/sal
echo "###"
echo ""