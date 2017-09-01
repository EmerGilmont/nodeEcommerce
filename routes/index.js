var express = require('express');
var router = express.Router();

// importe mongodb
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/inscription', function(req, res, next) {
  res.render('inscription');
});

router.get('/connexion', function(req, res, next) {
  res.render('connexion');
});

router.get('/connecter', function(req, res, next) {
  res.render('connecter');
});



// gestion de la connexion

router.post('/connexion', function(req, res){
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';

    MongoClient.connect(url, function(err, db){
        if(err) console.log("Unable to connect to server", err);
        else{
            console.log('Connected to server');

            var Name = req.body.account;
            var Password = req.body.password;
            var collection = db.collection('User');

            collection.find({Name: ''+Name+''}).toArray(function(err, result){
            	if (err) throw err;
            	else{
            		if(result[0].Password == Password){
            			var okMsg = "Nom de compte et mot de passe vérifier"
            			console.log(okMsg);
            			res.redirect('connecter');
            			db.close();
            		}else{
            			console.log("Mot de passe ou nom de compte incorrect");
            			res.redirect('connexion');
            			db.close();
            		}
            	}
            })
            db.close();
        }
    })
})

module.exports = router;
