var readline = require('readline'),
    util     = require('util'),
    mongoose = require('mongoose'),
    CryptoJS = require("crypto-js");

// Own libs
var User     = require('../models/user').getModel(),
    Logger   = require('../logging').logger(),
    configDB = require('../config/database-config.js');

var rl  = readline.createInterface({ input:  process.stdin, output: process.stdout });

/**
 * Public function to add a user to the application.
 */
var addUser = function() {
    util.puts('\n# --------- Benutzer anlegen -------------- #');

    var user = {};

    function _getUsername() {
        rl.question('Username: ', function(username) {
            if(username.length === 0) {
                util.puts('Sie müssen einen Benutzernamen angeben.');
                _getUsername();
            }
            else {
                // Prüfen, ob Benutezrname bereits vorhanden ist.
                User.findOne({username: username}, function(err, userExists) {
                    if(err) { /* TODO: Handle error */ }
                    else if(userExists) {
                        util.puts(util.format('Der Benutzername %s ist bereits vergeben. Bitte geben Sie einen anderen Benutzernamen an.', username));
                        _getUsername();
                    }
                    else {
                        user.username = username;
                        _getFirstName();
                    }
                });
            }
        });
    }

    function _getFirstName() {
        rl.question('Vorname: ', function(firstName) {
            if(firstName.length === 0) {
                util.puts('Bitte geben Sie einen Benutzernamen ein.');
                _getFirstName();
            }
            else {
                user.firstName = firstName;
                _getLastName();
            }
        });
    }

    function _getLastName() {
        rl.question('Nachname: ', function(lastName) {
            if(lastName.length === 0) {
                util.puts('Bitte geben Sie einen Nachnamen ein.');
                _getLastName();
            }
            else {
                user.lastName = lastName;

                // Ask for and set the user password
                setUserPassword(user, function(user) {
                    registerUser(user, menu);
                });
            }
        });
    }

    util.puts('Bitte geben Sie die Benutzerdaten des neuen Benutzers an.');
    _getUsername(); // starte mit erstem Schritt
};

var authenticate = function(onAuthSuccess, onAuthFail) {
    var userHash    = 'c56f8dca6714b13a39675227f39a84e1666e0ad3a7ba4bbb674413d589a1b506057158ff8a1f706590aaa43022578138eef93d4afeeb52c0b6f58c9fe1a6ee08',
        passordHash = '8f6c44c5ab410d9ea7b018346928870cf7f2f219d3a02cb3749e231b8c94be42e42e5bee8558ee7ed7588cdeb39b69baa806331c44417454f05c8c3aa5b7a239';

    var authErrors = 0;

    function _getAuthUser() {
        rl.question('Benutzer: ', function(user) {
            _getAuthPassword(user);
        });
    }

    function _getAuthPassword(user) {
        rl.question('Passwort: ', function(password) {

            var check = _checkAuthentication(user, password);

            if(check) {
                onAuthSuccess();
            }
            else {
                authErrors++;
                util.puts('Benutzer oder Passswort falsch.');

                if(authErrors === 3) {
                    onAuthFail();
                }
            }
        });
    }

    function _checkAuthentication(user, password) {
        user     = encrypt(user);
        password = encrypt(password);

        if(user === userHash && password === passordHash) {
            return true;
        }

        return false;
    }

    util.puts('Zum Starten der Anwendung müssen Sie sich authentifizieren');
    _getAuthUser();
}

/**
 * Public function to delete a user of the application
 * @return {[type]} [description]
 */
var deleteUser = function() {
    util.puts('\n# ------------ Benutzer löschen ----------- #');
    function _deleteUser(username) {

        var onSucess = function(user) {
            user.remove(function(err) {
                if(err) {
                    util.puts('Beim Löschen des Benutzers ist ein Fehler aufgetreten.');
                }
                else {
                    util.puts(util.format('Der Benutzer "%s %s" wurde erfolgreich gelöscht.', user.firstName, user.lastName));
                    menu();
                }
            });
        };

        var onFail = function() {
            listUsers();
        };

        getUser(username, onSucess, onFail);
    }

    // Alle Benutzer anzeigen
    var question = 'Welcher Benutzer soll entfernt werden?\n';
    listUsers(question, _deleteUser);
};

/**
 * Encrpyts a given text.
 * @param  {string} password Text to encrypt.
 * @return {string}          Returns the encrpyted text.
 */
var encrypt = function(text) {
    var i;
    for(i = 0; i < 100; i++) {
        text = CryptoJS.SHA3(text).toString();
    }
    return text;
};

/**
 * Stops the programm and exits the process.
 */
var exit = function() {
    util.puts('\nAnwendung wird beendet.');
    rl.close();
    process.exit();
};

/**
 * Get user model from DB for a given username.
 * @param  {[type]} onQuerySuccess [description]
 * @param  {[type]} onQueryFail   [description]
 * @return {[type]}                [description]
 */
var getUser = function(username, onQuerySuccess, onQueryFail) {
    User.findOne({'username': username}).exec(function(err, user){
        if(err) {
            util.puts('Beim Löschen des Benutzers ist ein Fehler aufgetreten.');
            menu();
        }
        else if(!user) {
            util.puts('Der angegebene Benutzer konnte nicht gefundern werden.');
            onQueryFail();
        }
        else {
            onQuerySuccess(user);
        }
     });
};

/**
 * Get all users from DB.
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getUsers = function(callback) {
    // Prepare query
    var query = User.find().select('username firstName lastName').sort('username');

    // Execute query
    query.exec(function(err, users) {
        if(err) {
            util.puts('Beim Abrufen der Benutzer ist ein Fehler aufgetreten.');
            menu();
        }

        if(callback) {
            callback(users);
        }
    });
};

/**
 * Public function for listing all users in console.
 * @param  {[type]}   question [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var listAllUsers = function() {
    util.puts('\n# --------- Alle Benutzer anzeigen -------- #');
    listUsers(null, menu);
};

/**
 * Private function to retrieve all users and show in console.
 * @param  {[type]}   question [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var listUsers = function(question, callback) {
    util.puts('Registrierte Benutzer werden abgerufen.');

    var i, intervalId, userList = null;

    function _listUsers() {
        util.print('Bitte Warten: ');
        intervalId = setInterval(function() {
            util.print('#');
        }, 500);

        setTimeout(function(){


        getUsers(function(users) {
            clearInterval(intervalId);
            util.puts('');
            userList = users;
            for(i = 0; i < userList.length; i++) {
                var user = userList[i];
                util.puts(util.format('[%s]: %s (%s %s)', i+1, user.username, user.firstName, user.lastName));
            }

            // If a question is given, ask for it.
            if(question) {
                _askForUsername();
            }
            else if(callback){
                callback();
            }
        });
        }, 5000);
    }

    function _askForUsername() {
        util.puts('[q]: Abbruch');
        rl.question(question, function(answer) {
            if(answer.length === 0) {
                util.puts('Bitte geben Sie einen Benutzer an!');
            }
            else if(answer == '0' || answer > userList.length) {
                util.puts('Bitte geben Sie einen gültigen Benutzer an!');
                _askForUsername();
            }
            else if(answer === 'q') {
                menu();
            }
            else if(callback) {
                var username = userList[answer-1].username;
                callback(username);
            }
        });
    }

    _listUsers();
};

/**
 * Shows application menu in console.
 */
var menu = function() {
    util.puts('\n# ------------------ Menu ----------------- #');
    util.puts('# [1]: Neuen Benutzer anlegen               #');
    util.puts('# [2]: Benutzer löschen                     #');
    util.puts('# [3]: Passwort eines Benutzers ändern      #');
    util.puts('# [4]: Alle Benutzer anzeigen               #');
    util.puts('# [5]: Beenden                              #');
    util.puts('# ----------------------------------------- #');

    rl.question('Was möchten Sie tun? ', function(answer) {
        switch(answer) {
            case '1': addUser(); break;
            case '2': deleteUser(); break;
            case '3': updateUserPassword(); break;
            case '4': listAllUsers(); break
            case '5': exit(); break;
            default:  util.puts('Falsche Eingabe.'); menu(); break;
        };
    });
};

/**
 * Prepares the DB connection for the used application.
 * @param  {Function} callback Callback function wich will be invoekd, if the connection is established successfully.
 */
var prepareDbConnection = function(environment, callback) {
    Logger.info('UserManagement', 'prepareDbConnection', 'Initialize database connection.');

    var connectionUrl, db;
    // Initialize database connection
    if('production' === environment) {
        Logger.info('UserManagement', 'prepareDbConnection', 'Execution environment of server app: "Production".');
        connectionUrl = configDB.prod.url;
    }
    else if('development' === environment){
        Logger.info('UserManagement', 'prepareDbConnection', 'Execution environment of server app: "Development".');
        connectionUrl = configDB.dev.url;
    }
    else {
        Logger.info('UserManagement', 'prepareDbConnection', 'Execution environment of server app: "Test".');
        connectionUrl = configDB.test.url;
    }
    Logger.info('UserManagement', 'prepareDbConnection', 'Application will user DB connection '+connectionUrl+'.');
    mongoose.connect(connectionUrl);

    // Set up the db connection
    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'DB connection error:'));

    db.once('open', function() {
        // If DB connection is established, run express server.
        Logger.info('UserManagement', 'prepareDbConnection', 'Database connection established.');

        callback();
    });
};

/**
 * Registers a user using passport authentication.
 * @param  {[type]}   user     User to register.
 * @param  {Function} callback Callback function which will be invoked, if the user was registerd successfully.
 */
var registerUser = function(user, callback) {
    var password = encrypt(user.password);
    User.register(user, password, function(err, account) {
        if (err) {
            util.puts(util.format('Bei der Registrierung des Benutzers ist ein Fehler aufgetreten. %s', err));
            menu();
        }
        else {
            util.puts(util.format('Benutzer "%s %s" wurde erfolgreich registriert', user.firstName, user.lastName));
            if(callback) {
                callback();
            }
        }
    });
}

/**
 * Asks for a password for the given user and sets the password of the user.
 * @param {[type]}   user     User to set the password for.
 * @param {Function} callback Callback function which will be invoked, if the password was set successfully.
 */
var setUserPassword = function(user, callback) {

    function _getPassword() {
        rl.question('Passwort: ', function(password) {
            if(password.length === 0) {
                util.puts('Bitte geben Sie ein Passwort ein.');
                _getPassword();
            }
            else {
                user.password = password;
                _getPasswordRepetition();
            }
        });
    }

    function _getPasswordRepetition() {
        rl.question('Passwort wiederholen: ', function(password) {
            if(password.length === 0) {
                util.puts('Bitte geben Sie das Passwort erneut ein.');
                _getPasswordRepetition();
            }
            else if(password !== user.password) {
                util.puts('Das angegeben Passwort und die Wiederholung waren nicht identisch. \n Bitte geben Sie erneut das Passwort ein.');
                _getPassword();
            }
            else {
                if(callback) {
                    callback(user);
                }
            }
        });
    }

    _getPassword();
}

/**
 * Starts the application.
 */
var start = function() {
    var getDbConnectionForEnvironment = function(environment) {
        prepareDbConnection(environment, function() {
            // After db connection is established show menu for further actions.
            menu();
        });
    };

    var getEnvironment = function() {

    util.puts('\n# --------------- Umgebung --------------- #');
    util.puts('# Bitte geben Sie zunächst an, für welche   #');
    util.puts('# Umgebung die Benutzer bearbeitet werden   #');
    util.puts('# sollen:                                   #');
    util.puts('# [1]: Production                           #');
    util.puts('# [2]: Development                          #');
    util.puts('# [3]: Test                                 #');
    util.puts('# ----------------------------------------- #');

    rl.question('Bitte geben Sie die Umgebung an: ', function(environment) {
        switch(environment) {
            case '1': getDbConnectionForEnvironment('production'); break;
            case '2': getDbConnectionForEnvironment('development'); break;
            case '3': getDbConnectionForEnvironment('test'); break;
            default: start(); break;
        }
    });

    };

    var onAuthSucess = function() {
        getEnvironment();
    };

    var onAuthFail = function() {
        exit();
    }

    util.puts('\n# ---------- User Management Tool --------- #');
    util.puts('#                                           #');
    util.puts('# Herzliche Willkomen zum User Management   #');
    util.puts('# Tool für "Was sollen wir futtern?         #');
    util.puts('#                                           #');
    util.puts('# ----------------------------------------- #');

    // First, the user has to authenticate
    authenticate(onAuthSucess, onAuthFail);
};

/**
 * Public function to update the password of a user. Asks for user of which the password should be updated.
 */
var updateUserPassword = function() {
    util.puts('\n# ------------ Passwort ändern ------------ #');

    function _updatePassword(username) {

        var onSucess = function(user) {
            setUserPassword(user, function(user) {
                // Save user with new password
                user.save(function(err, savedUser) {
                    if(err) {
                        util.puts('Beim Speichern des neuen Passworts ist ein Fehler aufgetreten!');
                        listUsers();
                    }
                    else {
                        util.puts('Das Passwort wurde erfolgreich gespeichert.');
                        menu();
                    }
                });
            });
        };

        var onFail = function() {
            listUsers();
        };

        getUser(username, onSucess, onFail);
    }

    // Alle Benutzer anzeigen
    var question = 'Das Passwort welches Benutzers soll geändert werden?\n';
    listUsers(question, _updatePassword);
}

// Start program
start();