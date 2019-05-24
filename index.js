const server = require('./src/config/server');

server.listen(process.env.PORT || 3000, function(){
    console.log("Server runing")
});