const http = require('http')

const server = http.createServer((req, res) => {
    res.write('Welcome to Docker!')
    res.end()
})
const port = 3000

server.listen(port, () => {
    console.log(`Backend service is running in ${port}`)
})