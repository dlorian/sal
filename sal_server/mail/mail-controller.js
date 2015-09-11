//
var Handlebars = require('handlebars');

var fs   = require('fs'),
    path = require('path');

//
var Logger = require('../logging').logger();

var mailConfig, sendgrid;
// Import mail configuration
try {
    mailConfig = require('../mail.json');

    if(!mailConfig.apiUser || !mailConfig.apiKey) {
        throw new Error('No apiUser or apiKey defined for sending mails. Could not set up mail controller');
    }

    sendgrid  = require('sendgrid')(mailConfig.apiUser, mailConfig.apiKey);
} catch(err) {
    throw new Error('Error while loading mail configuration. [' + err.code +'].');
}

/**
 * Private
 * Compiles the given Handlebars html template and fills with data.
 * @param  {String} htmlTpl Handlebars template to compile.
 * @param  {Object} data    Data used to fill the template
 * @return {String}         Returns the compiled Handlebars template.
 */
var _renderHtmlTemplate = function(htmlTpl, data) {
    Logger.info('MailController', '_renderHtmlTemplate', 'Invocation of _renderHtmlTemplate().');

    try {
        // Compile template and fill with data
        return Handlebars.compile(htmlTpl)(data);;
    }
    catch(err) {
        Logger.error('MailController', '_renderHtmlTemplate', 'Error while compiling template.', err);
    }
};

/**
 * Private
 * Sends mail with the given attributes
 * @param  {String}   to       Email address of the destination
 * @param  {String}   from     Email address of the source
 * @param  {String}   subject  Subject of the email
 * @param  {String}   text     Body of the email
 * @param  {Function} callback Function which will be invoked, when email was send.
 */
var _send = function(type, to, from, subject, text, callback) {
    if(!to) {
        return Logger.error('Mail', '_send', 'Error occured while sending mail. "to" address is undefined');
    }

    if(!from) {
        return Logger.error('Mail', '_send', 'Error occured while sending mail. "from" address is undefined');
    }
    if(!sendgrid) {
        return Logger.error('Mail', '_send', 'Error occured while sending mail. sendGrid is not defined. Unalbe to send mail.');
    }

    var email = new sendgrid.Email({to: to, from: from, subject: subject});

    if(type === 'html') {
        email.setHtml(text);
    }
    else {
        email.setText(text);
    }

    Logger.info('Mail', '_send', 'Send '+type+' mail to "'+to+'" with subject "'+subject+'".');
    sendgrid.send(email, callback);
};

var _sendExceptionMail = function(errMsg, errObj) {
    var to      = mailConfig.exceptionMail.to,
        from    = mailConfig.exceptionMail.from,
        subject = mailConfig.exceptionMail.subject;

    // Callback function
    var sendCallback = function(err, json) {
        if (err) {
            return Logger.error('Mail', '_sendExceptionMail', 'Error occured while sending Exception mail to "'+to+'".', err);
        }
        Logger.info('Mail', '_sendExceptionMail', 'Exception mail was send successfully to "'+to+'".');
    };

    // Default text
    var message = "An exception occured at WSWF.";

    if(errMsg) {
        message += "\n\rError message: "+ errMsg + ".";
    }

    if(errObj) {
        message += "\n\rError object: ";
        for (var key in errObj) {
            if(errObj.hasOwnProperty(key)) {
                // Do not process inherited properties
                message += "\n" + key + ":" + errObj[key];
            }
        }
    }

    if(!mailConfig.exceptionMail.to) {
         return Logger.error('Mail', 'sendExcpetionMail', 'No "to" address is specified within the mail configuration for sending exception mail.');
    }

    _send(to, from, subject, message, sendCallback);
};

var _sendMail = function(type, to, subject, text) {
    Logger.info('MailController', '_sendMail', 'Invocation of _sendMail().');

    // Get the address from mail configuration
    var from = mailConfig.mail.from;

    var sendCallback = function(err, json) {
        if (err) {
            return Logger.error('Mail', '_sendMail', 'Error occured while sending mail to "'+to+'".', err);
        }
        Logger.info('Mail', '_sendMail', 'Mail was send successfully to "'+to+'".');
    };

    _send(type, to, from, subject, text, sendCallback);
};

/**
 * Imports a file from the templates folder.
 * @param  {String}   name     Name of the file to import.
 * @param  {Function} callback Function which will be invoked, when file was imported.
 */
exports.importTemplate = function(name, callback) {
    Logger.info('MailController', 'importTemplate', 'Invocation of importTemplate().');

    var filepath = __dirname + '/templates/' + name;
    try {
        var filename = require('path').resolve(filepath);
        Logger.info('MailController', 'importTemplate', 'Try to import template "'+filename+'".' );

        fs.readFile(filename, 'utf8', function(err, file) {
            if(err) {
                Logger.error('MailController', 'importTemplate', 'Error while reading file "'+name+'"', err);
                return callback(err);
            }

            Logger.info('MailController', 'importTemplate', 'Import of template "'+filename+'" successfull.' );
            return callback(null, file);
        });
    } catch (e) {
        Logger.error('MailController', 'importTemplate', 'Error occurred while reading file "'+name+'"', e);
        callback(e);
    }
}

exports.renderHtml = function(tpl, data) {
    Logger.info('MailController', 'renderHtml', 'Invocation of renderHtml().');
    return _renderHtmlTemplate(tpl, data);
}

/**
 * Sends a text email to the given email address.
 * @param  {String} to      Destination mail address
 * @param  {String} subject Subject of the mail
 * @param  {String} message Body message
 */
exports.sendMail = function(to, subject, message) {
    Logger.info('MailController', 'sendMail', 'Invocation of sendMail().');
    _sendMail('text', to, subject, message);
}

/**
 * Sends a Html email to the given email address.
 * @param  {String} to      Destination mail address
 * @param  {String} subject Subject of the mail
 * @param  {String} message Body message
 */
exports.sendHtmlMail = function(to, subject, html) {
    Logger.info('MailController', 'sendHtmlMail', 'Invocation of sendHtmlMail().');
    _sendMail('html', to, subject, html);
}

//_sendMail('html', 'f.dorau@ymail.com', 'Handlebars Test', 'WTF');

/**
 * Sends an excpetion mail to the address specified within
 * in the mail configuration.
 * Note: If no address is specified, email will be dropped.
 *
 * @param  {String} errMsg Error message which will be send
 * @param  {String} errObj Additional error object, which will be added to
 *                         the email body.
 */
exports.sendExceptionMail = function(errMsg, errObj) {
    Logger.info('MailController', 'sendExceptionMail', 'Invocation of sendExceptionMail().');
    _sendExceptionMail(errMsg, errObj);
}