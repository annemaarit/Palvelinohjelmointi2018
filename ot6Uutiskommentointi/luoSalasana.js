const crypto = require("crypto");

let salasana = "karhukopla";

let tiiviste = crypto.createHash("SHA512")
                     .update(salasana)
                     .digest("hex");

console.log(tiiviste);