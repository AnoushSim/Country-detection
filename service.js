const mongoose = require('mongoose');
const app = (require('express'))();
const UsersSchema = require('./model');
const bodyParser = require('body-parser');
const utils = require('./utils');
const ipstack = require('ipstack');

let ipstack_APIKey = 'dcfb911dd798e214072b90a62941b8c8';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const connection = mongoose.createConnection('mongodb://localhost:27017/users', {useNewUrlParser: true});
const users = connection.model( 'users', UsersSchema, 'users');

app.post('/registration', (req, res) => {
     ipstack(req.ip, ipstack_APIKey, (err, response) => {
         let user = {};

         user.country = (response && response.country_name) ? response.country_name : 'Unknown';
         user.username = req.body.username;
         user.email = req.body.email;
         user.age = req.body.age;
         user.gender = req.body.gender;
         user.password = req.body.password;

         users.create(user).then(data => res.send('Created')).catch(err => res.send('Something went wrong'))
     })
});

app.post('/login', (req,res) => {
     ipstack(req.ip, ipstack_APIKey, (err, response) => {

         let country = (response && response.country_name) ? response.country_name : 'Unknown';
         users.findOne({username: req.body.username, password: req.body.password}).then(user => {
             console.log(user);
             if(user.country === country) {
                 res.send({success: true, message: 'Success'})
             } else {
                 let text = "It seems you have changed your location. To approve it's you, please click to this link";
                 utils.sendMail(user.email,'Recovery Email', text);
                 res.send({success:false, message: 'Check your email. It seems you have changed your location '})
             }
         }).catch(err => {
             res.json({success:false , message:'Username or password is not correct'})
         })
     })
});


app.listen(5678, () => {
    console.log('Example app listening on port 5678!');
});