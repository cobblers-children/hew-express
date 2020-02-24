/*
 * Initialize log4js
 */

const util = require("util");
const http = require("http");
const https = require("https");
const log4js = require("log4js");
const correlator = require("express-correlation-id");

log4js.addLayout("json", function (config) {
    return function (logEvent) {
        const { startTime: time, level, categoryName: category, correlationId = correlator.getId(), data } = logEvent;
        const msg = data.length ? util.format(...data) : undefined;

        return JSON.stringify({time, level: level.levelStr, category, msg, "correlation-id": correlationId });
    }
});

log4js.configure({
    appenders: { out: { type: "stdout", layout: { type: "json" } } },
    categories: { default: { appenders: ["out"], level: "info" } }
});

function setDefaultHeaders(agent) {
    const addRequest = agent.addRequest.bind(agent);

    agent.addRequest = function (request, ...args) {
        request.setHeader("X-Correlation-ID", correlator.getId());

        addRequest(request, ...args);
    };

    return agent;
}

http.globalAgent = setDefaultHeaders(new http.Agent());
https.globalAgent = setDefaultHeaders(new https.Agent());
