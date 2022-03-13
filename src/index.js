const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  if(!customer) {
    return response.status(400).json({ error: 'Customer not found!' })
  }
  request.customer = customer;
  return next();
}

app.use(express.json());

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4();
  customers.push({
    cpf,
    name,
    id,
    statement: [],
  });

  return response.status(201).send();
});

// app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

//localhost:3333
app.listen(3333);
