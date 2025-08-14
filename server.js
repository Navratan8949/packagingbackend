const app = require('./app');
const connectDB = require('./database/db');

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).send("Setup backend from the server.js");
  });

app.listen(PORT, () => {
    connectDB().then(()=>{
        console.log(`Server running on port ${PORT}`.bgBlue.white);
    })
});
  
module.exports = app;