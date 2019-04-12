const mongoose = require('mongoose');
const app = (require('express'))();
const ipstack = require('ipstack');
const validator = require('validator')
const passwordHash = require('password-hash');
const bodyParser = require('body-parser');
const UsersSchema = require('./model');
const utils = require('./utils');



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
         user.password = passwordHash.generate(req.body.password);
         if(validator.isEmail(user.email)) {
             users.create(user).then(data => res.send('Created')).catch(err => res.send('Something went wrong'))
         } else {
             res.send('Please type valid email address');
         }

     })
});

app.post('/login', (req,res) => {
     ipstack(req.ip, ipstack_APIKey, (err, response) => {

         let country = (response && response.country_name) ? response.country_name : 'Unknown';
         users.findOne({username: req.body.username}).then(user => {
             if(passwordHash.verify(req.body.password, user.password)) {
                 if(user.country === country) {
                     res.send({success: true, message: user.key})
                 } else {
                     let text = "It seems you have changed your location. To approve it's you, please click to this link: ";
                     let url = 'some link that will be clicked in client side and will work "/recover/country" put request';
                     utils.sendMail(user.email,'Recovery Email', text + url);
                     res.send({success:false, message: 'Check your email. It seems you have changed your location '})
                 }
             } else {
                 res.send('Password is not correct');
             }
         }).catch(err => {
             res.json({success:false , message:'Username is not correct'})
         })
     })
});


app.put('/recover/country', (req,res) => {
    ipstack(req.ip, ipstack_APIKey, (err, response) => {
        let country = (response && response.country_name) ? response.country_name : 'Unknown';
        users.updateOne({key: req.body.apikey},{$set: {country: country}}).then(result => {
            if(result.nModified)
                res.json({status:true, message: 'Geolocation updated'})
            else res.json({status:false, message: 'Invalid API Key'})
        }).catch(err => {
            res.json({status:false, message: 'Something went wrong'})
        })

    })
});

app.listen(1234, () => {
    console.log('Example app listening on port 1234!');
});
