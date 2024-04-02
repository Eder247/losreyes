const mysql = require("mysql");
const express = require("express");
const { render } = require("ejs");
const { query } = require("express");
const ejs = require("ejs");
var router = express.Router()
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require('nodemailer');


class Server
{

    constructor()
    {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    middlewares()
    {
        //Paginas estaticas
        this.app.use(express.static("public"));
        //View Engine
        this.app.set("view engine", "ejs");
        
    }

    routes()
    {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kirbyeder50@gmail.com', // Coloca aquí tu dirección de correo electrónico
            pass: 'naui omfl pntq ekqp' // Coloca aquí tu contraseña de correo electrónico
        }
    });
    
      this.app.get('/data', (req, res) => {
        let con = mysql.createConnection(
          {   
            host: "35.225.195.179",
            user: "root",
            password: "1234",
            database: "los_reyes"
          });
      
        con.query('SELECT * FROM Agenda ', function (err,rows,) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json({ data: rows })
          }
        })
      });

        this.app.get("/admins",(request,response) =>
        {
            let correo = request.query.correo;
            let password = request.query.password;
            
            let con = mysql.createConnection(
                {   
                    host: "35.225.195.179", 
                    user: "root",
                    password: "1234",
                    database: "los_reyes"
                });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                con.query("Select * from root where Correo = ? and password = ?",[correo, password],function (err, results) {
                  if (err) throw err;
                  if (results.length > 0)
                  {
                    response.redirect("/root");
                  } 
                  else{
                    con.query("Select * from usuario where Correo = ? and password = ?",[correo, password],
                    function (err, results) {
                      if (err) throw err;
                      if (results.length > 0)
                      {
                        response.redirect("/main");
                      } 
                      else{
                        response.redirect("/login(usuarioinvalido).html");
                      }
                    });
                  }
                });
              });

        });

        this.app.get("/regist",(request,response) =>
        {
            let Nombre = request.query.Nombre;
            let Telefono = request.query.Telefono;
            let Correo = request.query.Correo;
            let Password = request.query.Password;

            let con = mysql.createConnection(
                {   
                  host: "35.225.195.179",
                    user: "root",
                    password: "1234",
                    database: "los_reyes"
                });

            con.connect(function(err){if (err) throw err;});
            con.query("Select * from usuario where Correo = ?",[Correo],
              function (err, results) 
              {
                if (err) throw err;
                if (results.length > 0)
                {
                  response.redirect("register(CorreoRepetido).html");
                } 
                else
                {
                    con.query("insert into usuario values(?,?,?,?)",[Nombre,Telefono,Correo,Password],
                    function (err, results) 
                    {
                     if (err) throw err;
                     if (results.length > 0)
                      {
                        console.log("1 record inserted");
                        response.redirect("/index.html");
                      } 
                      else
                      {
                        response.redirect("/index.html");
                      }
                    });
                 }
              });
         });

         this.app.get("/root", function (req, res, next) {
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });
        
          con.query('SELECT * FROM Agenda ', function (err,rows,) {
            if (err) {
              res.render('roots', { data: '' })
            } else {
              res.render('roots', { data: rows })
            }
          })
        });

        this.app.get("/search", function (req, res, next) {
          let citas = req.query.citas;
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });
        
          con.query('SELECT * FROM Agenda where citas = ? ', [citas], function (err,rows,) {
            if (err) {
              res.render('roots', { data: "" })
            } else {
              res.render('roots', { data: rows })
            }
          })
        });

        this.app.get("/main", function (req, res, next) {
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });
        
          con.query('SELECT corte,precio FROM cortes ', function (err,rows,) {
            if (err) {
              res.render('main', { data: '' })
            } else {
              res.render('main', { data: rows })
            }
          })
        });
        
        this.app.get('/eliminar/:cliente/:citas/:hora/:barbero',(req,res) => {
          const cliente = req.params.cliente;
          const citas = req.params.citas;
          const hora = req.params.hora;
          const barbero = req.params.barbero;

          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });
          
          con.query("delete from Agenda where citas = ? and hora = ? and barbero = ?", [citas,hora,barbero], (err) => {
              if (err) {throw err;
              } else {
                con.query('SELECT * FROM Agenda ', function (err,rows,) {
                  if (err) {
                    req.flash(err)
                    res.render('roots', { data: '' })
                  } else {
                    res.redirect('/root')
                  }
                });
              }
            });
        })

        this.app.get("/cortes", function (req, res, next) {
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });

          con.query('SELECT * FROM cortes ', function (err,rows,) {
            if (err) {
              res.render('cortes', { data: '' })
            } else {
              res.render('cortes', { data: rows })
            }
          })
        });
        this.app.get("/main", function (req, res, next) {
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });

          con.query('SELECT * FROM cortes ', function (err,rows,) {
            if (err) {
              res.render('cortes', { data: '' })
              console.log(data)
            } else {
              res.render('cortes', { data: rows })
            }
          })
        });

        this.app.get('/editar/:corte',(req,res) => {
          const corte = req.params.corte;
          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });
          
          con.query("select corte,precio,dato from cortes where corte = ?", [corte], (err, results) => {
              if (err) {
                throw err;
              } else {
                con.query('SELECT * FROM cortes ', function (err,rows,) {
                  if (err) {
                    req.flash(err)
                    res.render('editar', { cortes: results[0] });
                  } else {
                    res.render('editar', { cortes: results[0] });
                  }
                });
              }
            });
        })

        this.app.get("/editar2", function (request, res, next) {
          let corte = request.query.corte;
          let precio = request.query.precio;
          let dato = request.query.dato;

          let con = mysql.createConnection(
            {   
              host: "35.225.195.179",
              user: "root",
              password: "1234",
              database: "los_reyes"
            });

            con.query("update cortes set corte = ?, precio = ? where dato = ?",
            [corte,precio,dato], (err) => {
              if (err) {throw err;
              } else {
                con.query('SELECT * FROM cortes ', function (err,rows,) {
                  if (err) {
                    res.render('cortes', { data: '' })
                  }
                  else {
                    res.render('cortes', { data: rows })
                  }
                });
              }
            });

          
 
        });

         this.app.get("/agendar",(request,response) =>
         {
             let citas = request.query.citas;
             let barbero = request.query.barbero;
             let cliente = request.query.cliente;
             let hora = request.query.hora;
             let dia = request.query.dia;

             let con = mysql.createConnection(
                 {   
                  host: "35.225.195.179",
                  user: "root",
                  password: "1234",
                  database: "los_reyes"
                 });
 
             con.connect(function(err){if (err) throw err;});
             con.query("Select * from Agenda where citas = ? and hora = ? and barbero = ?",[citas,hora,barbero],
               function (err, results) 
               {
                 if (err) throw err;
                 if (results.length > 0)
                 {
                   response.render("repetido")
                 }
                 else
                 {
                  con.query("select * from Agenda where cliente = ?", [cliente],
                  function (err, results){
                    if (err) throw err;
                    if (results.length > 1)
                    {
                      response.render("repetido2");
                    }
                 else
                 {
                  con.query("insert into Agenda values(?,?,?,?,?)",[barbero,citas,cliente,hora,dia],
                  function (err, results) 
                     {
                      if (err) throw err;
                      {
                          con.query("select * from Agenda where barbero = ? and citas = ? and cliente = ? and hora = ? and dia = ?",[barbero,citas,cliente,hora,dia],
                          function (err, result)
                          {
                            if (err) throw err;
                            let resultado =[{citas: result[0].citas,
                              barbero: result[0].barbero,
                              cliente: result[0].cliente,
                              hora: result[0].hora,
                              dia: result[0].dia
                          }];
                          const mailOptions = {
                            from: 'kirbyeder50@gmail.com', // Dirección de correo electrónico del remitente
                            to: 'kirbyeder@hotmail.com', // Dirección de correo electrónico del destinatario
                            subject: 'Nueva cita creada', // Asunto del correo electrónico
                            text: 'Se ha creado una nueva cita: ' + JSON.stringify(resultado) // Cuerpo del correo electrónico
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                              console.log(error);
                          } else {
                              console.log('Email sent: ' + info.response);
                          }
                      });
                            {
                              response.render('res', {resultado});
                            }
                      });
                      }
                     });
                    }
                    })
                  }
               });
          });
    }

    listen(){
        this.app.listen(this.port, () => 
        {
         console.log("http://127.0.0.1:" + this.port); 
        });
    }
 }

module.exports = Server;