const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
var connection = 'mongodb+srv://admin:1812@cluster0-mug8f.mongodb.net/<dbname>?retryWrites=true&w=majority';

console.log('Waddup');

MongoClient.connect(connection, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('movie-quotes');
        const quotesCollection = db.collection('quotes');

        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ extended: true }));

        app.listen(3100, function () {
            console.log('listening on port 3100')
        });

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: req.body.replaced },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => { res.json('Success') })
            .catch(error => console.error(error))
        });

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete');
                }
                res.json('Deleted quote');
            })
            .catch(error => console.error(error));
        })
    })
    .catch(error => console.error(error))

