const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();

console.log("Vapid Public Key:", vapidKeys.publicKey);
console.log("Vapid Private Key:", vapidKeys.privateKey);

/**
 * To get keys, run command: "run getvapid.js"
 * 
 Vapid Public Key: BArIaJA-Z9KkT5IIsdsPttxJHyN9teWLX3GE4Mpv0e2VcLmxneP7UrfxP8rq9bkkJbFljl_-n-bHVvbsFpc6kLY
 Vapid Private Key: HpE0Wqcf35rJEaCChIh2K5S9_aQR9-cEC2uXfJm70Io
 */
