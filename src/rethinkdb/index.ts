import { EventEmitter } from "events";

import { Server } from "../server";

import { Logger } from "../logging";

const config: IConfig = require("../configs/development");

const thinky = require("thinky")(config.rethinkdb);
const type = thinky.type;

const Commands = thinky.createModel("commands", {
    id: type.string(),
    commandName: type.string(),
    response: type.string(),
    calls: type.number(),
    channel: type.string(),
    service: type.string()
});

const Quotes = thinky.createModel("quotes", {
    id: type.string(),
    quoteId: type.number(),
    quote: type.string(),
    token: type.string()
});

const Users = thinky.createModel("users", {
    id: type.string(),
    username: type.string()
});

const Repeats = thinky.createModel("repeats", {
    id: type.string(),
    command: type.string(),
    interval: type.number(),
    channel: type.string()
});

const Config = thinky.createModel("config", {
    id: type.string(),
    token: type.string(),
    services: type.object(),
    announce: type.object(),
    spam: type.object()
});

interface Result {
    "new_val": any;
    "old_val": any;
};

export class RethinkDB extends EventEmitter {
    // TODO: Figure out variable types for all the things
    constructor(public config: IConfig, public server: Server) {
        super();
    }

    watchCommands() {
        Commands.changes().then((feed: any) => {
            feed.each((error: any, doc: any) => {
                if (error) {
                    Logger.error(error);
                }
                let action: "deleted" | "created" | "updated" = "updated";

                if (doc.isSaved() === false) {
                    action = "deleted";
                } else if (doc.getOldValue() == null) {
                    action = "created";
                }
                // Emit the event back to the server.
                this.emit("broadcast:channel", {
                    channel: doc.channel,
                    action: "deleted",
                    event: "command",
                    service: "",
                    data: doc
                });
            });
        }).error((error: any) => Logger.error(error));
    }

    watchQuotes() {
        Quotes.changes().then((feed: any) => {
            feed.each((error: any, doc: any) => {
                if (error) {
                    Logger.error(error);
                }
                let action: "deleted" | "created" | "updated" = "updated";

                if (doc.isSaved() === false) {
                    action = "deleted";
                } else if (doc.getOldValue() == null) {
                    action = "created";
                }
                // Emit the event back to the server.
                this.emit("broadcast:channel", {
                    channel: doc.channel,
                    action: action,
                    event: "quote",
                    service: "",
                    data: doc
                });
            });
        }).error((error: any) => Logger.error(error));
    }

    watchRepeats() {
        Repeats.changes().then((feed: any) => {
            feed.each((error: any, doc: any) => {
                if (error) {
                    Logger.error(error);
                }
                let action: "deleted" | "created" | "updated" = "updated";

                if (doc.isSaved() === false) {
                    action = "deleted";
                } else if (doc.getOldValue() == null) {
                    action = "created";
                }
                // Emit the event back to the server.
                this.emit("broadcast:channel", {
                    channel: doc.channel,
                    action: action,
                    event: "repeat",
                    service: "",
                    data: doc
                });

                if (action === "created") {
                    this.server.repeat.addRepeat(doc);
                } else if (action === "deleted") {
                    this.server.repeat.removeRepeat(doc);
                } else if (action === "updated") {
                    this.server.repeat.removeRepeat(doc.getOldValue());
                    this.server.repeat.addRepeat(doc);
                }
            });
        }).error((error: any) => Logger.error(error));
    }

    watchConfig() {
        Config.changes().then((feed: any) => {
            feed.each((error: any, doc: any) => {
                if (error) {
                    Logger.error(error);
                }
                let action: "deleted" | "created" | "updated" = "updated";

                if (doc.isSaved() === false) {
                    action = "deleted";
                } else if (doc.getOldValue() == null) {
                    action = "created";
                }
                // Emit the event back to the server.
                this.emit("broadcast:channel", {
                    channel: doc.channel,
                    action: action,
                    event: "config",
                    service: "",
                    data: doc
                });
            });
        }).error((error: any) => Logger.error(error));
    }

    getRepeats(channel: String): Object {
        return Repeats.filter({ "channel": channel }).run().then((res: Object) => {
            return res;
        });
    }

    channelExists(channel: string) {
        Users.filter({ username: channel }).run().then((res: Object) => {
            return res === [];
        });
    }
}
