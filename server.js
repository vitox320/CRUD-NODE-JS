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
    res.render("carlos\\todos.ejs", { dados });
  } catch (err) {
    console.error(err);
  }
});

app.get("/cadastro", (req, res) => {
  res.render("carlos\\cadastro.ejs");
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

app.get("/deletar/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    await db.collection("colessaum").deleteOne({ _id: ObjectId(uid) });

    res.redirect("carlos\\todos.ejs");
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

    res.render("carlos\\user.ejs", { dados });
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
