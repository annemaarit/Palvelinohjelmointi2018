//tokenin luonti

const jwt=require("jsonwebtoken");
let token=jwt.sign({
                    "kayttajanimi":"t11client.herokuapp.com"
},"kissakala");
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDc4MjY2MTZ9.MGlL2uDwlwptemOCduKitgtVd0zjJlzyUCB9DGTtsf8
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrYXl0dGFqYW5pbWkiOiJ0MTFjbGllbnQuaGVyb2t1YXBwLmNvbSIsImlhdCI6MTU0Nzg4NjQwMX0.X491S_OXUE-cqYIR1aQUpzgOXaYGwHAAC1_FJv45MTw
console.log(token);