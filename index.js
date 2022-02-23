const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Perg = require('./database/Pergunta');
const Res = require('./database/Resposta');

//database
connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso");
    })
    .catch(() => {
        console.log(msgErro);
    });

app.set('view engine','ejs');
app.use(express.static('public')); //local que esta os arquivos estaticos

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req,res) {
    Perg.findAll({raw:true, order:[['id','DESC']]}).then(perguntas => {
        res.render('index',{
            perguntas: perguntas
        });
    });    
});

app.get('/perguntar', function(req,res){
    res.render('perguntar');
});

app.post('/salvarpergunta', function(req,res){
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Perg.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/pergunta/:id',function(req,res) {
    var id = req.params.id;
    Perg.findOne({
        where:{id:id}
    }).then(pergunta => {
        if(pergunta != undefined){

            Res.findAll({
                where:{perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas => {
                    res.render('perguntas',{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });            
        }else{
            res.redirect('/');
        }        
    });
});

app.post('/resposta',(req,res) => {
    var corpo = req.body.corpo;
    var pergunta = req.body.pergunta;

    Res.create({
        corpo: corpo,
        perguntaId:pergunta
    }).then(() => {
        res.redirect('/pergunta/' + pergunta);
    })
})

app.listen(3636, () => {
    console.log('Servidor rodando');
});