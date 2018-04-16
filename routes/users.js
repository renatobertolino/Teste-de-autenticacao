var express = require('express')
var app = express()
 
// Lista de usuários
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users ORDER BY nome DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'User List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List', 
                    data: rows
                })
            }
        })
    })
})

app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        nome: '',
        senha: ''        
    })
})

app.post('/add', function(req, res, next){    
    req.assert('nome', 'Nome requerido').notEmpty()           //Validate name
    req.assert('senha', 'Senha requerida').notEmpty()             //Validate age
 
    var errors = req.validationErrors()
    
    if( !errors ) {  
        var user = {
            nome: req.sanitize('nome').escape().trim(),
            senha: req.sanitize('senha').escape().trim()
        }
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        nome: user.nome,
                        senha: user.senha                    
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        nome: '',
                        senha: ''                    
                    })
                }
            })
        })
    }
    else {   
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('user/add', { 
            title: 'Add New User',
            nome: req.body.nome,
            senha: req.body.senha,
        })
    }
})


app.get('/login', function(req,res){
    var nome= req.body.nome;
    var senha = req.body.senha;

    req.getConnection(function(error, conn){

        conn.query('SELECT * FROM users WHERE nome = ? and senha = ?',[nome],[senha], function (error, results, fields) {
            if (error) {
              console.log("error ocurred",error);
              res.send({
                "code":400,
                "failed":"error ocurred"
              })
            }else{
        
              if(results.length >0){
                if([0].nome == nome){
                  res.send({
                    "code":200,
                    "success":"login sucessfull"
                      });
                }
                else{
                  res.send({
                    "code":204,
                    "success":"Email and password does not match"
                      });
                }
              }
              else{
                res.send({
                  "code":204,
                  "success":"Email does not exits"
                    });
              }
            }
        })
    })    
  })

module.exports = app;