var express = require('express')
var app = express()

 
app.get('/', function(req, res) {
    res.render('index', {title: 'Bla bla bla'})
})

app.post('/login', function(req,res){
    let nome= req.body.nome;
    let senha = req.body.senha;

    req.getConnection(function(error, conn){

        conn.query('SELECT * FROM users WHERE nome = ?',[nome], function (error, results, fields) {
          
          if (error) {
              console.log("error ocurred",error);
              res.send({
                "code":400,
                "failed":"error ocurred"
              })
            }else{
        
          var senhaTemp = results[0].senha;
          var nomeTemp = results[0].nome;
          
              
              if(results.length >0){
            
                if(senhaTemp == senha){
                       
                      res.redirect('/users');
                }
                else{
                 
                  res.send({
                    "code":204,
                   "success":"Usuário e senha não coincidem",
                    });
                }
              }
              else{
                res.send({
                  "code":204,
                  "success":"Email não existe"
                    });
              }
            }
        })
    })    
  })

module.exports = app;