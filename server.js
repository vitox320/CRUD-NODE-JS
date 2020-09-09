const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const expressValidator = require('express-validator')
const { ObjectId } = require("mongodb")

const MongoCliente = require('mongodb').MongoClient
const uri = "mongodb+srv://vitox320:88662479@cluster0.wqdxn.mongodb.net/<dbname>?retryWrites=true&w=majority"

MongoCliente.connect(uri,(err,client)=>{
    if (err) return console.log(err)
    
    db = client.db('crudzada')

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

    if(req.body.nome == '' || req.body.email == '' || req.body.cpf == '' || req.body.telefone == ''|| req.body.endereco == ''||req.body.  cidade == ''||req.body.estado == ''){
    res.send("Preencha todos os campos")
    
}else{
        
        db.collection('data').save(req.body,(err,result) =>{
        if (err) return console.log(err)
          
        console.log('salvo no banco de dados')
        res.redirect('/show')
              
    })
    }
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

app.set('view engine','ejs')


app.listen(8080,function(){
    console.log("Servidor rodando na porta 8080")
})