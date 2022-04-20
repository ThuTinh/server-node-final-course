const express = require('express');
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

// Body Parser
var bodyPaser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyPaser.urlencoded({extended: true}));
// parse application/json
app.use(bodyPaser.json())


app.listen(port, () => console.log(`Server listening on port ${port}!`))

app.get('/', (req, res) => {
  res.send('Hello world')
})
app.post('/', (req, res) => {
  res.send('Hello world')
})

const fs  = require('fs');
fs.readFile("./config.json", "utf8", function(err, data){
    if(err){ throw err };
    var obj = JSON.parse(data);
    //Connect Mongodb
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://'+obj.moongodb.username+':'+obj.moongodb.password+'@'+obj.moongodb.server+'/'+obj.moongodb.dbname+'?retryWrites=true&w=majority', function(err){
        if(!err){
            console.log("Mongo connected successfully.");
            require("./routes/authencation")(app);
            require("./routes/uploads")(app);
        } else {
            console.log("Mongo connected failed!. " + err);
        }
    }); 
});
