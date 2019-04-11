const ipstack = require('ipstack');

let i = '8.8.8.8'

ipstack(i,"dcfb911dd798e214072b90a62941b8c8",(err, response) => {
    console.log(response.country_name)
})