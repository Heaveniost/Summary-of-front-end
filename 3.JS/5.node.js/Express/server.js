const express = require('express');
const app = express();
 
app.use('/public', express.static('public'));


const path = __dirname +'/'+ 'Express' + '/' + 'index.html' 
app.get('/index.html', (req, res) => res.sendFile(__dirname  + '/index.html' ))
 
app.get('/process_get', (req, res) => {
    const response = {
        'first_name': req.query.first_name,
        'last_name': req.query.last_name
    }
    console.log(response)
    res.end(JSON.stringify(response))
})

const server = app.listen(8081,  () => {
 
  const host = server.address().address
  const port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})