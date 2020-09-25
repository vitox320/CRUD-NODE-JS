const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const expressValidator = require('express-validator')
const { ObjectId } = require("mongodb")

app.set('view engine','ejs')
const MongoCliente = require('mongodb').MongoClient
const uri = "mongodb+srv://vitox320:88662479@cluster0.wqdxn.mongodb.net/<dbname>?retryWrites=true&w=majority"

MongoCliente.connect(uri,(err,client)=>{
    if (err) return console.log(err)
    
    db = client.db('crud')
    
    app.listen(3000,function(){
    console.log("Servidor rodando na porta 3000")
})

})

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    
    res.render('index.ejs')
})

app.get("/",(req,res)=>{
    let cursor = db.collection('data').find()
})


app.get("/show",(req,res)=>{
    db.collection('data').find().toArray((err,results)=> {
        if (err) return console.log(err)
        res.render('show.ejs',{data:results})

    })
})

app.post("/show",(req,res)=>{
        
        db.collection('data').save(req.body,(err,result) =>{
        if (err) return console.log(err)
          
        console.log('salvo no banco de dados')
        res.redirect('/show')
              
    })
    
})

app.route("/edit/:id")
.get((req,res)=>{
    let id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err,result) => {
        if (err) return res.send(err)
        res.render('edit.ejs',{data:result})
    })
})
.post((req,res)=>{
    let id = req.params.id 
    let name = req.body.nome
    let email1 = req.body.email
    let cpf1 = req.body.cpf
    let telefone1 = req.body.telefone
    let endereco1 = req.body.endereco
    let cidade1 = req.body.cidade
    let estado1 = req.body.estado
    let sexo1 = req.body.sexo

    db.collection('data').updateOne({_id: ObjectId(id)}, {

        $set: {
            nome : name,
            email : email1,
            cpf : cpf1,
            telefone : telefone1,
            endereco : endereco1,
            cidade : cidade1,
            estado : estado1,
            sexo : sexo1
        }
    }, (err,result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    
    })
})

app.route('/delete/:id')
.get((req,res)=>{
    let id = req.params.id 

    db.collection('data').deleteOne({_id:ObjectId}, (err,result)=>{
        if (err) return res.send(500,err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/show')
    })
})



/*   CRUD - DENUNCIAS  - INICIO    */

app.get("/",(req,res)=>{
    
    res.render('izadora/denunciar.ejs')
})

app.get("/",(req,res)=>{
    let cursor = db.collection('denuncia').find()
})

app.get("/denunciar",(req,res)=>{
    db.collection('denuncia').find().toArray((err,results)=> {
        if (err) return console.log(err)
        res.render('izadora/denunciar.ejs',{denuncia:results})

    })
})

app.get("/showDenuncias",(req,res)=>{
    db.collection('denuncia').find().toArray((err,results)=> {
        if (err) return console.log(err)
        res.render('izadora/showDenuncias.ejs',{denuncia:results})

    })
})

app.post("/denunciar",(req,res)=>{
        
    db.collection('denuncia').save(req.body,(err,result) =>{
    if (err) return console.log(err)
      
    console.log('salvo no banco de dados')
    res.redirect('/showDenuncias')
          
})

})

app.route("/editDenuncias/:id")
.get((req,res)=>{
    let id = req.params.id

    db.collection('denuncia').find(ObjectId(id)).toArray((err,result) => {
        if (err) return res.send(err)
        res.render('izadora/editDenuncias.ejs',{denuncia:result})
    })
})
.post((req,res)=>{
    let id = req.params.id 
    let name = req.body.nome
    let email = req.body.email
    let cpf = req.body.cpf
    let telefone = req.body.telefone
    let estado = req.body.estado
    let sexo = req.body.sexo
    let quem = req.body.quem
    let qualDado = req.body.qualDado

    db.collection('denuncia').updateOne({_id: ObjectId(id)}, {

        $set: {
            nome : name,
            email : email,
            cpf : cpf,
            telefone : telefone,
            estado : estado,
            sexo : sexo,
            quem : quem,
            qualDado : qualDado,
        }
    }, (err,result) => {
        if (err) return res.send(err)
        res.redirect('/showDenuncias')
        console.log('Atualizado no Banco de Dados')
    
    })
})

app.route('/deleteDenuncia/:id')
.get((req,res)=>{
    let id = req.params.id

    db.collection('denuncia').deleteOne({_id:ObjectId(id)}, (err,result)=>{
        if (err) return res.send(500,err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/showDenuncias')
    })
});

/*   CRUD - DENUNCIAS  - FIM       */

