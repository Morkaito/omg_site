const express = require('express');
const knex = require('./database')
const instaRoutes = express.Router();

instaRoutes.use(express.urlencoded({extended: true}))
instaRoutes.use(express.json());

const payments_links = {
    "200i": "http://mpago.la/2aM25FP",
    "500i": "http://mpago.la/198xYUc",
    "1000i": "http://mpago.la/18H9p8M",
    "2000i": "http://mpago.la/2nZymNw",
    "200br": "http://mpago.la/2dGuhTz",
    "500br": "http://mpago.la/1mpPjF5",
    "1000br": "http://mpago.la/22ThBnw",
    "2000br": "http://mpago.la/2q29Nfo",
    "5000br": "http://mpago.la/1uTrNY5",
    "10kbr": "http://mpago.la/2dwAoGE"
}

instaRoutes.post('/insta_agreement', (req, res) => {
    const content_body = req.body;
    let errors = {};
    Object.keys(content_body).forEach((key) => {
        if (!Boolean(key)){
            errors[key] = 'Campo inválido';
        }
    });

    if(Object.keys(errors).length == 0) {        
        try {
            const { arroba, plan } = content_body;
            knex('info_purchase').insert({arroba: arroba, plan: plan})
                .then((result) => {
                    res.redirect(payments_links[plan]);
                }).catch((error) => {
                    res.status(500).json(error);
                });
                        
        } catch(err) {
            res.status(500).json({status: 'error'});
        }        
    } else {
        res.status(400).json(errors)
    }

});

module.exports = instaRoutes;