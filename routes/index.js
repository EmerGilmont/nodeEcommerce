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

router.get('/addProduct', function(req, res, next) {
  res.render('addProduct');
});

router.get('/produit', function(req, res, next) {

    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';

    // Connect to the server
  MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        // We are connected
        console.log('Connection established to', url);
     
        // Get the documents collection
        var collection = db.collection('Produit');
     
        // Find all students
        collection.find({}).toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            res.render('produit',{
     
              // Pass the returned database documents to Jade
              "produit" : result
            });
          } else {
            res.send('No documents found');
          }
          //Close connection
          db.close();
        });
      }
    });
});

router.get('/panier', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the Server', err);
          } else {
            // We are connected
            console.log('Connection established to', url);
         
            // Get the documents collection
            var collection = db.collection('Panier');
         
            // Find all students
            collection.find({}).toArray(function (err, result) {
              if (err) {
                res.send(err);
              } else if (result.length) {
                res.render('panier',{
         
                  // Pass the returned database documents to Jade
                  "panier" : result
                });
              } else {
                res.send('No documents found');
              }
              //Close connection
              db.close();
            });
          }
    });
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

            if(Name == "" || Password == ""){
                alert("il manque le nom ou le mot de passe")
                res.redirect('connexion');
            }else{
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
            }
            db.close();
        }
    })
})


router.post('/addProduct', function(req, res){

    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';

    MongoClient.connect(url, function(err, db){

        if(err) console.log("Unable to connect to server", err);
        else{

            console.log('Connected to server');

            var name = req.body.nameProduct;
            var price = req.body.priceProduct;
            var quantity = req.body.quantityProduct;
            var img = req.body.imgProduct;

            var collection = db.collection('Produit');

            if(name == "" || price == "" || quantity == "" || img == ""){
                console.log("Il manque le nom, prix, quantitée ou l'image")
                res.redirect('addProduct');
            }else{
                collection.insertOne({
                    "name" : name,
                    "price" : price,
                    "quantity" : quantity,
                    "img" : img
                }, function(err, res){
                    if(err) throw err;
                    else console.log("Données insérées");
                    db.close();
                })
                res.redirect('addProduct');
            }
        }
    })
})


router.post('/addPanier', function(req, res){
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';

    MongoClient.connect(url, function(err, db){

        if(err) console.log("Unable to connect to server", err);
        else{

            console.log('Connected to server');

            var name = req.body.name;
            var price = req.body.price;
            var quantity = req.body.quantity;
            var img = req.body.img;

            var collection = db.collection('Panier');

            collection.findOne({name: ''+name+''}, function(err, test) {
                if (err) throw err;
                if(test == null){
                    collection.insertOne({
                        "name" : name,
                        "price" : price,
                        "quantity" : 1,
                        "img" : img
                    }, function(err, res){
                        if(err) throw err;
                        else console.log("Données insérées");
                        db.close();
                    })
                    res.redirect('Produit');
                }else{
                    console.log("Ce produit existe déjà");
                    res.redirect('Produit');
                }
            });
        }
    })
})

router.post('/modPanier', function(req, res){
    console.log(req.body);
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/eCommerceData';


    if(req.body.decrement == "1"){
        // fonction pour décrémenter
        MongoClient.connect(url, function(err, db){
            if(err) console.log("Unable to connect to server", err);
            else{
                console.log('Connected to server');

                var name = req.body.name;
                var quantity = req.body.quantity;
                var quantityMod = '15';

                var collection = db.collection('Panier');

                collection.update(
                    {"name": ""+name+""},
                    {$set: {"quantity" : quantityMod}})
                db.close();
            }
        })

        res.redirect('Panier');
    }else if(req.body.increment == "1"){
        // fonction d'incrémentation
        res.redirect('Panier');
    }else if(req.body.delete == "1"){
        // on delete l'élément
        res.redirect('Panier');
    }
})

module.exports = router;
