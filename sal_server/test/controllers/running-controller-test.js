var moment = require('moment'),
    mongoose = require('mongoose');

// Supress Logging in console
process.env.NODE_ENV = 'test';

var DBManager = require('../../db-manager');

// Import controller to test
var runningController = require('../../controllers/running-controller');

var Running = require('../../models/running').getModel(),
    User    = require('../../models/user').getModel();

// Models for test
var testUser, testRunning;

var clearDatabase = function(done) {
    // Remove all existing tours in the tours collection
    Running.remove({}, function(err) {
        if(err) done(err);

        Running.count(function(err, count) {
            if(err) done(err);

            count.should.eql(0, "Should be no item in foods collection.");

            done();
        });
    });
};

var clearUsers = function(next) {
    User.remove({}, function(err) {
        if(err) done(err);

        User.count(function(err, userCount){
            if(err) done(err);

            userCount.should.eql(0, "Should be no item in users collection.");
            next();
        });
    });
};

var createTestUser = function(username, firstname, lastname, password, done) {
    var user = new User({ username: username, firstName: firstname, lastName: lastname, password: password });
    user.save(done);
};

var createTestRunning = function(running, user, done) {
    if(moment.isDate(running)) {
        testRunning = new Running({ date: running, createdAt: new Date(), createdBy: user });
    }
    else if(typeof food === 'object') {
        running.createdAt = new Date();
        running.createdBy = user;
        testRunning = new Running(running);
    }

    testRunning.save(done);
};

var createTestRunnings = function(date, count, testUser, done) {
    var i = 0, createdRunnings = [];

    var createRunning = function() {
        createTestRunning(date, testUser, function(err, savedRunning) {
            if(err) done(err);

            createdRunnings.push(savedRunning);
            moment(date).subtract(1, 'days');
            i++

            if(i < count) {
                return createRunning();
            }
            done(err, createdRunnings);
        });
    };

    createRunning();
};

var assertRunning = function(running, createdByUser, modifiedByUser) {
    running.should.be.an.Object;

    // Id should not be empty
    (running.id === undefined).should.be.false;

    (running.createdBy === undefined).should.be.false;
    (running.createdAt === undefined).should.be.false;

    // Check createdBy
    running.createdBy.should.be.an.Object;
    running.createdBy.id.toString().should.be.equal(createdByUser.id.toString());

    // Check createdAt
    running.createdAt.should.be.Date;

    if(modifiedByUser) {
        (running.modifiedBy === undefined).should.be.false;
        (running.modifiedAt === undefined).should.be.false;

        // Check createdBy
        running.modifiedBy.should.be.an.Object;
        running.modifiedBy.id.toString().should.be.equal(modifiedByUser.id.toString());

        // Check createdAt
        running.modifiedAt.should.be.Date;
    }
    else {
        (running.modifiedAt === undefined).should.be.true;
        (running.modifiedBy === undefined).should.be.true;
    }
};

var getAndAssertRunning = function(originalRunning, user, done) {
    runningController.getRunning(originalRunning.id, function(err, running) {
        if(err) done(err);

        running.date.should.be.Date;
        (moment(running.date).isSame(originalRunning.date, 'day')).should.be.true;

        assertRunning(running, user);

        done(err, running);
    });
};

var updateAndAssertRunning = function(updatedRunning, createdByUser, modifiedByUser, done) {
    runningController.updateRunning(updatedRunning.id, updatedRunning, modifiedByUser, function(err, running) {
        if(err) done(err);

        running.date.should.be.Date;
        (moment(running.date).isSame(updatedRunning.date, 'day')).should.be.true;

        assertRunning(running, createdByUser, modifiedByUser);
        done(err, running);
    });
}

describe('RunningController', function() {

    before(function(done){
        DBManager.initializeDBConnection('test', done);
    });

    beforeEach(function(done) {
        clearUsers(function(err) {
            if(err) done(err);

            createTestUser('Testuser', 'Test', 'User', 'test123', function(err, user) {
                if(err) done(err);

                user.should.be.an.Object.and.should.not.be.empty;

                testUser = user;
                done(err);
            });
        });
    });

    describe('#createRunning()', function() {

        beforeEach(function(done){
            clearDatabase(done);
        });

        it('should create new running', function(done) {
            var runningToCreate = { date: new Date() };

            runningController.createRunning(runningToCreate, testUser, function(err, running) {
                if(err) done(err);

                assertRunning(running, testUser);

                done();
            });
        });

        it('should not create running without date', function(done) {
            // Should throw an validation error cause name is required
            runningController.createRunning({}, testUser, function(err, running) {
                (err  !== undefined).should.be.true;
                (running === undefined).should.be.true;

                err.should.be.an.Object.and.should.not.be.empty;
                err.name.should.be.equal('ValidationError');

                (err.errors['date'] !== undefined).should.be.true;

                var dateError = err.errors['date'];
                dateError.should.be.an.Object;
                dateError.path.should.be.equal('date');

                // Verify that collection is empty
                Running.count(function(err, count) {
                    if(err) done(err);
                    count.should.eql(0, "Should be no item in runnings collection.");

                    done();
                });
            });
        });
    });

    describe('#getRunning()', function() {

        beforeEach(function(done) {
            clearDatabase(done);
        });

        it('should get cycling', function(done) {
            createTestRunning(new Date(), testUser, function(err, createdRunning) {
                getAndAssertRunning(createdRunning, testUser, done);
            });
        });

        it('should get error for wrong food id', function(done) {
            createTestRunning(new Date(), testUser, function(err, createdRunning) {
                var id = mongoose.Types.ObjectId();

                runningController.getRunning(id, function(err, running) {
                    // Getting a food with wrong id should return no error
                    // and no running of course
                    (err  === undefined).should.be.true;
                    (running === undefined).should.be.true;

                    done();
                });
            });
        });
    });

    describe('#getRunnings()', function() {

        var numOfRunnings = 5;

        before(function(done){
            clearDatabase(function(err){
                if(err) done(err);

                createTestRunnings(new Date(), numOfRunnings, testUser, function(err) {
                    done(err);
                });
            });
        });

        it('should get runnings', function(done) {
            var queryParams = {};
            runningController.getRunnings(queryParams, function(err, runnings) {
                if(err) done(err);

                runnings.should.be.an.Array;
                runnings.should.have.lengthOf(numOfRunnings);

                done();
            });
        });

        it('should get all runnings', function(done) {
            var queryParams = { limit: numOfRunnings + 1 };
            runningController.getRunnings(queryParams, function(err, runnings) {
                if(err) done(err);

                runnings.should.be.an.Array;
                runnings.should.have.lengthOf(numOfRunnings);

                done();
            });
        });

        it('should get 3 runnings', function(done) {
            var queryParams = { limit: 3 };
            runningController.getRunnings(queryParams, function(err, runnings) {
                if(err) done(err);

                runnings.should.be.an.Array;
                runnings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });

        it('should get 1 runnings', function(done) {
            var queryParams = { limit: 1 };
            runningController.getRunnings(queryParams, function(err, runnings) {
                if(err) done(err);

                runnings.should.be.an.Array;
                runnings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });

        /*it('should get no runnings', function(done) {
            var queryParams = { limit: 0 };
            runningController.getRunnings(queryParams, function(err, runnings) {
                if(err) done(err);

                runnings.should.be.an.Array;
                runnings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });*/
    });


    describe('#updateRunning()', function() {
        var testUser2;

        beforeEach(function(done){
            clearDatabase(function(err) {
                if(err) done(err);

                var running = {
                    date: moment().subtract(2, 'days')
                };

                createTestRunning(new Date(), testUser, function(err, running){
                    createTestUser('Testuser2', 'Test', 'User2', 'test123', function(err, user) {
                        if(err) done(err);

                        user.should.be.an.Object;

                        testUser2 = user;
                        done();
                    });
                });
            });
        });

        it('should update running date', function(done) {
            testRunning.date = moment(new Date()).subtract(1, 'days');
            updateAndAssertRunning(testRunning, testUser, testUser2, done);
        });
    });
});