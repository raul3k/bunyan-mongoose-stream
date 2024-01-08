const expect = require('chai').expect;
const sinon  = require('sinon');
const logStream = require('./../lib/logStream');

/**
 * test for the logStream
 */
describe('LogStream', function () {

    describe('Constructor', function () {

        it('should throw a error because no mongoose model is provided', function (done) {

            try {
                const newLog = logStream();
                done('Should not pass');
            } catch (e) {
                expect(e.message).to.equal('[LogStream] - Fatal Error - No mongoose model provided!');
                done()
            }

        });

        it('should create a logStream instance', function (done) {
            const newLog = logStream({model : {}});
            done();
        });



    });

    describe('_write - method', function () {

        let modelStub, saveStub;

        beforeEach(function (done) {
            modelStub = sinon.stub();
            saveStub = sinon.stub();
            modelStub.prototype.save = saveStub;
            done();
        });

        it('should call the save method of the mongoose model', function (done) {

            const newLog = logStream({model : modelStub});

            newLog._write(new Buffer('{"msg" : "test"}'),'UTF-8', function () {
               
            });

            expect(modelStub.called).to.be.true;
            expect(saveStub.called).to.be.true;
            expect(modelStub.calledBefore(saveStub)).to.be.true;

            done();

            
        });

    })
});