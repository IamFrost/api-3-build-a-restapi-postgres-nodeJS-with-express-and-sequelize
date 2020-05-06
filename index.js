const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const port = 3000;
var cors = require('cors');

app.use(cors()); // Use this after the variable declaration
app.use(express.json());

// you must not use like this, otherwise timestamp column will create problem
// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/test1');

const PGHOST = '127.0.0.1';
// const PGPORT = '';
const PGDATABASE = 'test1';
const PGUSER = 'postgres';
const PGPASSWORD = 'postgres';

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres',
    define: {
        timestamps: false
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Posts = sequelize.define('posts', {
    title: {
        type: Sequelize.STRING,
    },
    body: {
        type: Sequelize.STRING,
    },
    userid: {
        type: Sequelize.INTEGER,
    },
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    }
}, {
    freezeTableName: true,
});

// Note: using `force: true` will drop the table if it already exists
Posts.sync({
    force: false
}); // Now the `users` table in the database corresponds to the model definition

app.get('/', (req, res) => res.json({
    message: 'Hello World'
}));

app.get("/posts", (req, res) =>
    Posts.findAll().then((result) => res.json(result))
);

app.get("/posts/:id", (req, res) =>
    Posts.findByPk(req.params.id).then((result) => res.json(result))
);

app.post("/posts", (req, res) =>

    Posts.create({
        title: req.body.title,
        body: req.body.body,
        userid: req.body.userid,
        id: req.body.id
    }).then((result) => res.json(result))
    // .then(console.log("this is body: ",req.body.title,">",req.body.body,">",req.body.userid,">",req.body.id))
);

app.put("/posts/:id", (req, res) =>
    Posts.update({
        title: req.body.title,
        body: req.body.body,
        userid: req.body.userid,
        id: req.body.id
    }, {
        where: {
            id: req.params.id
        }
    }).then((result) => res.json(result))
);

app.delete("/posts/:id", (req, res) =>
    Posts.destroy({
        where: {
            id: req.params.id
        }
    }).then((result) => res.json(result))
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));