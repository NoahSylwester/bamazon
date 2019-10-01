var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

function viewProductSalesByDepartment() {

}

function createNewDepartment() {
  
}

connection.connect();

inquirer.prompt([{
  type: "list",
  name: "action",
  message: "Select an action",
  choices: [
    "View Product Sales by Department",
    "Create New Department"
  ]
}]).then(function(response) {
  switch (response.action) {
    case "View Product Sales by Department":
      viewProductSalesByDepartment();
      break;
    case "Create New Department":
      createNewDepartment();
      break;
  }
});