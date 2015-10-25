# **SAL** - Sport Activity Log#

Eine Web-Applikation für Sportaktivitäten

Bei **S**port **A**ctivity **L**og handelt es sich um eine Web-App, die die Möglichkeit bietet, seine Sportaktivitäten zu verwalten.

Die Anwendung teilt sich in zwei Projekte auf:

* **sal_server**: Komponenten der Server-Anwendung

* **sal_client**: Komponenten der Web-Anwendung

## Voraussetzungen für App ##
Die App nutzt folgenden Technologie-Stack

* Node.js
* NPM
* Ember-CLI
* MongoDB
* Bower

### Installation Nodejs ###
Die App basiert auf einer Nodejs-Anwendung. Um die Anwendung lokal ausführen zu können, muss zunächst [Node.js](https://nodejs.org) installiert werden.

Unter Ubuntu
```
#!javascript
sudo apt-get update
sudo apt-get install nodejs
```

Unter Codeanyhwere (Ubuntu) wird Ubuntu mit 
```
#!javascript
nodejs app.js
```
aufgerufen. 

Unter Mac mit 
```
#!javascript

node app.js
```


### Installation NPM ###
[NPM](https://www.npmjs.com/) dient als Grundlage für das Package-Management der gesamten Anwendung. Die Installation von NPM wird über das Betriebssystem durchgeführt.

Unter Ubuntu
```
#!javascript
sudo apt-get install npm
```

Unter MacOS X


### Installation Ember-CLI ###
[Ember-CLI](http://www.ember-cli.com) wird unter anderem benötigt zum Bauen der Client-Anwendung benötigt. Die Installation des Ember-CLI wird mittels npm durchgeführt.

```
#!javascript
npm install -g ember-cli
```


## Start App ##

## Bauen der Web-Anwendung ##
Die Webanwendung kann mit Hilfe des folgenden Befehls aus dem Client-Projekt heraus gebaut werden.

```
#!javascript

ember build
```
Die erzeugte Anwendung wird dabei in Verzeichnis *public* des Server-Projekts kopiert.