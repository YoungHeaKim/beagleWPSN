const express = ('express')
const bodyParser = ('body-parser')

const app = express()

app.use(bodyParser, json())

app.post('/user', (req, res) => {

})