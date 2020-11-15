var express = require('express')

var router = express.Router()
router.get('get', (req, res) => {
    res.send('get请求')
})

const app = express()
app.use(router)
app.listen('3000',() => {
    console.log('server running at ..')
})