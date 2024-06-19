const ls = require("lightstreamer-client");
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:1880/ws/lightstreamer'); // Connect to Node-RED WebSocket node

const lsClient = new ls.LightstreamerClient("http://push.lightstreamer.com", "ISSLIVE");
lsClient.connectionOptions.setSlowingEnabled(false);

const sub = new ls.Subscription("MERGE",["USLAB000053","NODE3000001","NODE3000005","NODE3000009","NODE3000008", "USLAB000086"],["TimeStamp","Value"]);

lsClient.connect();

sub.addListener({
    onSubscription: function () {
        console.log("Subscribed");
    },
    onUnsubscription: function () {
        console.log("Unsubscribed");
    },
    onItemUpdate: function (update) {
        const payload = {
            item: update.getItemName(),
            timestamp: update.getValue("TimeStamp"),
            value: update.getValue("Value")
        };
        ws.send(JSON.stringify(payload)); // Send data to Node-RED
        console.log(update.getItemName() + " : " + update.getValue("TimeStamp") + " " + update.getValue("Value"));
    }
});

lsClient.subscribe(sub);
