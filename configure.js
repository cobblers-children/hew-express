/*
 * Initialize log4js
 */

const log4js = require("log4js");
const util = require("util");

log4js.addLayout("json", function (config) {
    return function (logEvent) {
        const { startTime: time, level, categoryName: category, data } = logEvent;
        const msg = data.length ? util.format(...data) : undefined;

        return JSON.stringify({time, level: level.levelStr, category, msg });
    }
});

log4js.configure({
    appenders: { out: { type: "stdout", layout: { type: "json" } } },
    categories: { default: { appenders: ["out"], level: "info" } }
});

