require('dotenv').config()
const express = require('express');
const app = express();
const instaRoutes = require('./src/routes');
const crypto = require('crypto');
const knex = require('./src/database');
const cookie_parser = require('cookie-parser');
const cookie_encrypter = require('cookie-encrypter');

app.set('view engine', 'ejs');
app.set('views', './src/app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/app/assets'));
app.use(instaRoutes);
app.use(cookie_parser(process.env.SALT));
app.use(cookie_encrypter(process.env.SALT, { algorithm: 'aes-256-gcm' }));



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/like-or-followers', (req, res) => {
    res.render('like-or-followers');
});

app.get('/insta-followers', (req, res) => {
    res.render('insta-followers');
});

app.get('/insta-likes', (req, res) => {
    res.render('insta-likes');
});

app.get('/omega-panel', (req, res) => {
    res.render('omega-panel');
});

app.post("/omega-login", (req, res) => {
    const content_body = req.body;
    var errors = {};
    Object.keys(content_body).forEach((key) => {
        if (!Boolean(key)) {
            errors[key] = 'Campo inválido';
        }
    });
    if (Object.keys(errors).length == 0) {
        const { username, password } = content_body;
        const hash = crypto.pbkdf2Sync(password, process.env.SALT, 1000, 64, `sha512`).toString('hex');
        try {
            knex('users').returning('id').where({ username: username }).andWhere({ password: hash })
                .then((result) => {
                    let ns = result[0]['id'].toString() + username
                    res.cookie('usrlgd', ns, {
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        signed: true
                    });
                    res.redirect('omega-adm')
                }).catch((err) => res.status(400).json({ success: false, message: "invalid" }))
        } catch (err) {
            console.log('[!] - Error in database operation: ', err)
        }
    }
});

app.get('/omega-adm', (req, res) => {
    const cookie = req.signedCookies.usrlgd;
    if (!cookie) {
        res.redirect('omega-panel')
    } else {
        res.status(200).render('omega-adm');
    }
});


app.get('/info_purchase', (req, res) => {
    try {
        knex.select().table('info_purchase')
            .then((result) => {
                result.forEach((r) => {
                    let date = new Date(r['created_at'])
                    r['created_at'] = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
                });
                res.status(200).json({ result });
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log('[!] - Error: ', err)
    }
});


app.listen(process.env.PORT, () => console.log(`Server at running on port ${process.env.PORT}`))

