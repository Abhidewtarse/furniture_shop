const express = require("express");
const cors = require("cors");
var upload = require("express-fileupload");
var bodyparser = require("body-parser");



const app = express();
const port = 8081;
app.use(express.static("public/"))
var admin_route = require("./routes/admin_route");
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());



app.use("/", admin_route)


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


