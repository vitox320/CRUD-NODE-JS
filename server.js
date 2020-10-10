const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const expressValidator = require("express-validator");
const { ObjectId } = require("mongodb");

app.set("view engine", "ejs");
app.set("views", "views");
const MongoCliente = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://coviram:mobicrud@clustercrud.vqezz.gcp.mongodb.net/crudzada?retryWrites=true&w=majority";

MongoCliente.connect(uri, (err, client) => {
  if (err) return console.log(err);

  db = client.db("crudzada");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/", (req, res) => {
  let cursor = db.collection("data").find();
});

app.get("/show", (req, res) => {
  db.collection("data")
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err);
      res.render("show.ejs", { data: results });
    });
});

app.post("/show", (req, res) => {
  db.collection("data").save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log("salvo no banco de dados");
    res.redirect("/show");
  });
});

app
  .route("/edit/:id")
  .get((req, res) => {
    let id = req.params.id;

    db.collection("data")
      .find(ObjectId(id))
      .toArray((err, result) => {
        if (err) return res.send(err);
        res.render("edit.ejs", { data: result });
      });
  })
  .post((req, res) => {
    let id = req.params.id;
    let name = req.body.nome;
    let email1 = req.body.email;
    let cpf1 = req.body.cpf;
    let telefone1 = req.body.telefone;
    let endereco1 = req.body.endereco;
    let cidade1 = req.body.cidade;
    let estado1 = req.body.estado;
    let sexo1 = req.body.sexo;

    db.collection("data").updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          nome: name,
          email: email1,
          cpf: cpf1,
          telefone: telefone1,
          endereco: endereco1,
          cidade: cidade1,
          estado: estado1,
          sexo: sexo1,
        },
      },
      (err, result) => {
        if (err) return res.send(err);
        res.redirect("/show");
        console.log("Atualizado no Banco de Dados");
      }
    );
  });

app.route("/delete/:id").get((req, res) => {
  let id = req.params.id;

  db.collection("data").deleteOne({ _id: ObjectId }, (err, result) => {
    if (err) return res.send(500, err);
    console.log("Deletado do Banco de Dados!");
    res.redirect("/show");
  });
});

// Parte de Carlos
app.get("/todos", async (req, res) => {
  try {
    const dados = await db.collection("colessaum").find().toArray();
    res.render("carlos/todos.ejs", { dados });
  } catch (err) {
    console.error(err);
  }
});

app.get("/cadastro", (req, res) => {
  res.render("carlos/cadastro.ejs");
});

app.post("/cadastro", async (req, res) => {
  try {
    const data = {
      nome: req.body.nome,
      email: req.body.email,
      profissao: req.body.profissao,
      estado: req.body.estado,
      cep: req.body.cep,
      telefone: req.body.telefone,
      celular: req.body.celular,
      senha: crypto.createHash("sha1").update(req.body.senha).digest("hex"),
    };
    await db.collection("colessaum").insertOne(data);

    return res.redirect("/todos");
  } catch (err) {
    console.error(err);
  }
});

app.get("/effacer/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    await db.collection("colessaum").deleteOne({ _id: ObjectId(uid) });

    return res.redirect("/todos")
  } catch (err) {
    console.error(err);
  }
});

app.post("/user/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    const data = {
      nome: req.body.nome.trim(),
      email: req.body.email.trim(),
      profissao: req.body.profissao.trim(),
      estado: req.body.estado.trim(),
      cep: req.body.cep.trim(),
      telefone: req.body.telefone.trim(),
      celular: req.body.celular.trim(),
      senha: crypto.createHash("sha1").update(req.body.senha).digest("hex"),
    };

    const response = await db.collection("colessaum").updateOne(
      { _id: ObjectId(uid) },
      {
        $set: {
          nome: data.nome,
          email: data.email,
          profissao: data.profissao,
          estado: data.estado,
          cep: data.cep,
          telefone: data.telefone,
          celular: data.celular,
          senha: data.senha,
        },
      }
    );

    res.redirect(`/user/${uid}`);
  } catch (err) {
    console.error(err.Error);
  }
});

app.get("/user/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    const dados = await db
      .collection("colessaum")
      .find(ObjectId(uid))
      .toArray();

    res.render("carlos/user.ejs", { dados });
  } catch (err) {
    console.error(err);
  }
});

// Parte de carlos - Fim
/*   CRUD - PRODUTOS - IZADORA  - INICIO    */

app.get("/iza", (req, res) => {

    res.render('izadora/cadastrarProduto.ejs')
    let cursor = db.collection('produto').find()
})

app.get("/cadastrarProduto", (req, res) => {
    db.collection('produto').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('izadora/cadastrarProduto.ejs', { produto: results })

    })
})

app.get("/showProdutos", (req, res) => {
    db.collection('produto').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('izadora/showProdutos.ejs', { produto: results })

    })
})

app.post("/cadastrarProduto", (req, res) => {

    db.collection('produto').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/showProdutos')

    })

})

app.route("/editProduto/:id")
    .get((req, res) => {
        let id = req.params.id

        db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('izadora/editProduto.ejs', { produto: result })
        })
    })
    .post((req, res) => {
        let id = req.params.id
        let produto = req.body.produto
        let descricao = req.body.descricao
        let quantidade = req.body.quantidade
        let precoUnitario = req.body.precoUnitario
        let fornecedor = req.body.fornecedor
        let novoUsado = req.body.novoUsado
        let cor = req.body.cor
        let tamanho = req.body.tamanho

        db.collection('produto').updateOne({ _id: ObjectId(id) }, {

            $set: {
                produto: produto,
                descricao: descricao,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                fornecedor: fornecedor,
                novoUsado: novoUsado,
                cor: cor,
                tamanho: tamanho,
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/showProdutos')
            console.log('Atualizado no Banco de Dados')

        })
    })

app.route('/deleteProduto/:id')
    .get((req, res) => {
        let id = req.params.id

        db.collection('produto').deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Deletado do Banco de Dados!')
            res.redirect('/showProdutos')
        })
    });

/*   CRUD - PRODUTOS - IZADORA  - FIM       */


//--------------------config do Paulo ---------------------
//variáveisS
let colecao = 'CadProfissional';
var pgPrincipalP = "paulo/registros.ejs";
let pgCadastro = "paulo/cadastro.ejs";

//pagina principal
app.get('/registros', (req, res) => {
    db.collection(colecao).find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render(pgPrincipalP, { data: results })

    })
})

//página de cadastro
app.get('/cadastroP', (req, res) => {
    let cursor = db.collection(colecao).find()
    res.render(pgCadastro)
})

app.post('/cadastroP', (req, res) => {
    db.collection(colecao).save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/registros')
    })
})

//função editar
app.route('/editar/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection(colecao).find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('paulo/edit', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var sobrenome = req.body.sobrenome
        var email = req.body.email
        var tel = req.body.tel
        var endereco = req.body.endereco
        var cidade = req.body.cidade
        var uf = req.body.uf
        var profissao = req.body.profissao

        db.collection(colecao).updateOne({ _id: ObjectId(id) }, {
            $set: {
                name: name,
                sobrenome: sobrenome,
                email: email,
                tel: tel,
                endereco: endereco,
                cidade: cidade,
                uf: uf,
                profissao: profissao
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/registros')
            console.log('Atualizado no banco de dados')
        })
    })

//função excluir
app.route('/deletar/:id').get((req, res) => {
    var id = req.params.id

    db.collection(colecao).deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Pagado do Banco de dados!')
        res.redirect('/registros')
    })
})

//-------------------- fim da config do Paulo --------------------



//--------------------config de Vagner ---------------------
//variáveisS
var cole = 'CadEstagiario';
var pgPrincipalV = "Vagner/listagem.ejs";
let pgCad = "Vagner/cadastro.ejs";

//pagina principal
app.get('/listagem', (req, res) => {
    db.collection(cole).find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render(pgPrincipalV, { data: results })

    })
})

//página de cadastro
app.get('/cad', (req, res) => {
    let cursor = db.collection(cole).find()
    res.render(pgCad)
})

app.post('/cad', (req, res) => {
    db.collection(cole).save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/listagem')
    })
})

//função editar
app.route('/edita/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection(cole).find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('Vagner/edit', { data: result })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var nome = req.body.nome
        var sobrenome = req.body.sobrenome
        var cpf = req.body.cpf
        var email = req.body.email
        var telefone = req.body.telefone
        var instituicao = req.body.instituicao
        var curso = req.body.curso
        var semestre = req.body.semestre
        db.collection(cole).updateOne({
            _id: ObjectId(id)
        }, {
            $set: {
                nome: nome,
                sobrenome: sobrenome,
                cpf: cpf,
                email: email,
                telefone: telefone,
                instituicao: instituicao,
                curso: curso,
                semestre: semestre
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/listagem')
            console.log('Atualizado no banco de dados')
        })
    })

//função excluir
app.route('/excluir/:id').get((req, res) => {
    var id = req.params.id

    db.collection(cole).deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Pagado do Banco de dados!')
        res.redirect('/listagem')
    })
})


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});



//--------------------config (Ian) ---------------------

app.get("/cursos", (req, res) => {
    res.render('ian/index.ejs')
    let cursor = db.collection('curso').find()
})


app.get("/consultacursos", (req, res) => {
    db.collection('curso').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('ian/show.ejs', { data: results })

    })
})

app.post("/consultacursos", (req, res) => {

    db.collection('curso').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Aluno Cadastrado com Sucesso')
        res.redirect('/consultacursos')

    })

})

app.route("/atualizar/:id")
    .get((req, res) => {
        let id = req.params.id

        db.collection('curso').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('ian/edit.ejs', { data: result })
        })
    })
    .post((req, res) => {
        let id = req.params.id
        let name = req.body.nome
        let email1 = req.body.email
        let cpf1 = req.body.cpf
        let telefone1 = req.body.telefone
        let curso1 = req.body.curso
        let turno1 = req.body.turno
        let responsavel1 = req.body.responsavel
        let sexo1 = req.body.sexo

        db.collection('curso').updateOne({ _id: ObjectId(id) }, {

            $set: {
                nome: name,
                email: email1,
                cpf: cpf1,
                telefone: telefone1,
                curso: curso1,
                turno: turno1,
                responsavel: responsavel1,
                sexo: sexo1
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/consultacursos')
            console.log('Dados Atualizados com Sucesso')

        })
    })

app.route('/exclui/:id')
    .get((req, res) => {
        let id = req.params.id

        db.collection('curso').deleteOne({ _id: ObjectId }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Aluno Deletado')
            res.redirect('/consultacursos')
        })
    })
//-------------------- fim da config (Ian) ---------------------