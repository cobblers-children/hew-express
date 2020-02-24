const path = require("path");
const log4js = require("log4js");
const chai = require("chai");
const expect = chai.expect;

describe("JSON layout", function() {
    const configuration = require("./configure");
    const log4jsFiles = path.dirname(require.resolve("log4js"));
    const layouts = require(path.join(log4jsFiles, "layouts"));
    const LoggingEvent = require(path.join(log4jsFiles, "LoggingEvent"));

    let layout;

    beforeEach(function() {
        layout = layouts.layout("json");
    });

    it("was registered", function() {
        expect(layout).to.exist;
    });

    it("generates valid JSON", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, []);
        let result = layout(event);

        expect(() => JSON.parse(result)).not.to.throw();
    });

    it("names the fields properly", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, ["test"]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).to.have.property("time");
        expect(result).to.have.property("msg", "test");
    });

    it("handles arrays", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, [["123", "456"]]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).to.have.property("time");
        expect(result).to.have.property("msg", "[ '123', '456' ]");
    });

    it("handles objects", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, [{a: "a", b: "b"}]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).to.have.property("time");
        expect(result).to.have.property("msg", "{ a: 'a', b: 'b' }");
    });

    it("handles Error objects", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, [new Error("test")]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("msg");
        expect(result.msg).to.include("Error: test\n    at");
    });

    it("can concatenate string arguments", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, ["test", "123"]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).to.have.property("time");
        expect(result).to.have.property("msg", "test 123");
    });

    it("can concatenate mixed arguments", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, ["data is", {a: "a", b: "b"}]);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).to.have.property("time");
        expect(result).to.have.property("msg", "data is { a: 'a', b: 'b' }");
    });

    it("omits undefined fields", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, []);
        let result = JSON.parse(layout(event));

        expect(result).to.have.property("category", "foo");
        expect(result).to.have.property("level", "INFO");
        expect(result).not.to.have.property("msg");
    });

    it("emits the fields in order", function() {
        let event = new LoggingEvent("foo", log4js.levels.INFO, ["message"]);
        let result = JSON.parse(layout(event));

        expect(Object.keys(result)).to.deep.equal(["time", "level", "category", "msg"]);
    });
});