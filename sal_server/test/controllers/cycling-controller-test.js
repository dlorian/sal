var moment = require('moment'),
    mongoose = require('mongoose');

// Supress Logging in console
process.env.NODE_ENV = 'test';

var DBManager = require('../../db-manager');

// Import controller to test
var cyclingController = require('../../controllers/cycling-controller');

var Cycling = require('../../models/cycling').getModel(),
    User    = require('../../models/user').getModel();

// Models for test
var testUser, testCycling;

var clearDatabase = function(done) {
    // Remove all existing tours in the tours collection
    Cycling.remove({}, function(err) {
        if(err) done(err);

        Cycling.count(function(err, count) {
            if(err) done(err);

            count.should.eql(0, "Should be no item in cyclings collection.");

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

var createTestCycling = function(cycling, user, done) {
    if(moment.isDate(cycling)) {
        testCycling = new Cycling({ date: cycling, createdAt: new Date(), createdBy: user });
    }
    else if(typeof food === 'object') {
        cycling.createdAt = new Date();
        cycling.createdBy = user;
        testCycling = new Cycling(cycling);
    }

    testCycling.save(done);
};

var createTestCyclings = function(date, count, testUser, done) {
    var i = 0, createdCyclings = [];

    var createCycling = function() {
        createTestCycling(date, testUser, function(err, savedCycling) {
            if(err) done(err);

            createdCyclings.push(savedCycling);
            moment(date).subtract(1, 'days');
            i++

            if(i < count) {
                return createCycling();
            }
            done(err, createdCyclings);
        });
    };

    createCycling();
};

var assertCycling = function(cycling, createdByUser, modifiedByUser) {
    cycling.should.be.an.Object;

    // Id should not be empty
    (cycling.id === undefined).should.be.false;

    (cycling.createdBy === undefined).should.be.false;
    (cycling.createdAt === undefined).should.be.false;

    // Check createdBy
    cycling.createdBy.should.be.an.Object;
    cycling.createdBy.id.toString().should.be.equal(createdByUser.id.toString());

    // Check createdAt
    cycling.createdAt.should.be.Date;

    if(modifiedByUser) {
        (cycling.modifiedBy === undefined).should.be.false;
        (cycling.modifiedAt === undefined).should.be.false;

        // Check createdBy
        cycling.modifiedBy.should.be.an.Object;
        cycling.modifiedBy.id.toString().should.be.equal(modifiedByUser.id.toString());

        // Check createdAt
        cycling.modifiedAt.should.be.Date;
    }
    else {
        (cycling.modifiedAt === undefined).should.be.true;
        (cycling.modifiedBy === undefined).should.be.true;
    }
};

var getAndAssertCycling = function(originalCycling, user, done) {
    cyclingController.getCycling(originalCycling.id, function(err, cycling) {
        if(err) done(err);

        cycling.date.should.be.Date;
        (moment(cycling.date).isSame(originalCycling.date, 'day')).should.be.true;

        assertCycling(cycling, user);

        done(err, cycling);
    });
};

var updateAndAssertCycling = function(updatedCycling, createdByUser, modifiedByUser, done) {
    cyclingController.updateCycling(updatedCycling.id, updatedCycling, modifiedByUser, function(err, cycling) {
        if(err) done(err);

        cycling.date.should.be.Date;
        (moment(cycling.date).isSame(updatedCycling.date, 'day')).should.be.true;

        assertCycling(cycling, createdByUser, modifiedByUser);
        done(err, cycling);
    });
}

describe('cyclingController', function() {

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

    describe('#createCycling()', function() {

        beforeEach(function(done){
            clearDatabase(done);
        });

        it('should create new cycling', function(done) {
            // Create a plain object only with food
            var cyclingToCreate = { date: new Date() };

            cyclingController.createCycling(cyclingToCreate, testUser, function(err, cycling) {
                if(err) done(err);

                assertCycling(cycling, testUser);

                done();
            });
        });

        it('should not create cycling without date', function(done) {
            // Should throw an validation error cause name is required
            cyclingController.createCycling({}, testUser, function(err, cycling) {
                (err  !== undefined).should.be.true;
                (cycling === undefined).should.be.true;

                err.should.be.an.Object.and.should.not.be.empty;
                err.name.should.be.equal('ValidationError');

                (err.errors['date'] !== undefined).should.be.true;

                var dateError = err.errors['date'];
                dateError.should.be.an.Object;
                dateError.path.should.be.equal('date');

                // Verify that collection is empty
                Cycling.count(function(err, count) {
                    if(err) done(err);
                    count.should.eql(0, "Should be no item in cyclings collection.");

                    done();
                });
            });
        });
    });

    describe('#getCycling()', function() {

        beforeEach(function(done) {
            clearDatabase(done);
        });

        it('should get cycling', function(done) {
            createTestCycling(new Date(), testUser, function(err, createdCycling) {
                getAndAssertCycling(createdCycling, testUser, done);
            });
        });

        it('should get error for wrong food id', function(done) {
            createTestCycling(new Date(), testUser, function(err, createdCycling) {
                var id = mongoose.Types.ObjectId();

                cyclingController.getCycling(id, function(err, cycling) {
                    // Getting a food with wrong id should return no error
                    // and no cycling of course
                    (err  === undefined).should.be.true;
                    (cycling === undefined).should.be.true;

                    done();
                });
            });
        });
    });

    describe('#getCyclings()', function() {

        var numOfCyclings = 5;

        before(function(done){
            clearDatabase(function(err){
                if(err) done(err);

                createTestCyclings(new Date(), numOfCyclings, testUser, function(err) {
                    done(err);
                });
            });
        });

        it('should get cyclings', function(done) {
            var queryParams = {};
            cyclingController.getCyclings(queryParams, function(err, cyclings) {
                if(err) done(err);

                cyclings.should.be.an.Array;
                cyclings.should.have.lengthOf(numOfCyclings);

                done();
            });
        });

        it('should get all cyclings', function(done) {
            var queryParams = { limit: numOfCyclings + 1 };
            cyclingController.getCyclings(queryParams, function(err, cyclings) {
                if(err) done(err);

                cyclings.should.be.an.Array;
                cyclings.should.have.lengthOf(numOfCyclings);

                done();
            });
        });

        it('should get 3 cyclings', function(done) {
            var queryParams = { limit: 3 };
            cyclingController.getCyclings(queryParams, function(err, cyclings) {
                if(err) done(err);

                cyclings.should.be.an.Array;
                cyclings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });

        it('should get 1 cyclings', function(done) {
            var queryParams = { limit: 1 };
            cyclingController.getCyclings(queryParams, function(err, cyclings) {
                if(err) done(err);

                cyclings.should.be.an.Array;
                cyclings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });

        /*it('should get no cyclings', function(done) {
            var queryParams = { limit: 0 };
            cyclingController.getcyclings(queryParams, function(err, cyclings) {
                if(err) done(err);

                cyclings.should.be.an.Array;
                cyclings.should.have.lengthOf(queryParams.limit);

                done();
            });
        });*/
    });


    describe('#updateCycling()', function() {
        var testUser2;

        beforeEach(function(done){
            clearDatabase(function(err) {
                if(err) done(err);

                var cycling = {
                    date: moment().subtract(2, 'days')
                };

                createTestCycling(new Date(), testUser, function(err, cycling){
                    createTestUser('Testuser2', 'Test', 'User2', 'test123', function(err, user) {
                        if(err) done(err);

                        user.should.be.an.Object;

                        testUser2 = user;
                        done();
                    });
                });
            });
        });

        it('should update cycling date', function(done) {
            testCycling.date = moment(new Date()).subtract(1, 'days');
            updateAndAssertCycling(testCycling, testUser, testUser2, done);
        });
    });
});