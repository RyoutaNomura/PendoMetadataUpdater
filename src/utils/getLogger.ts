import Log4js from "log4js";

Log4js.configure({
    appenders: {
        "console": {
            type: "console",
            level: "all"
        },
        "file": {
            type: "file",
            level: "all",
            filename: 'system.log'
        }
    },
    categories: {
        "default": {
            appenders: [
                "console",
                "file"
            ],
            level: "all"
        }
    }
});

function getLogger() {
    return Log4js.getLogger();
}

export default getLogger;