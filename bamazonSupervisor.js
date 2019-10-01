const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const {table} = require('table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

function viewProductSalesByDepartment() {
  connection.query('SELECT * FROM departments', function (error, results) {
    // handle errors
    if (error) throw error;

    var salesTable = [["department_id".bold.brightCyan, "department_name".bold.brightCyan, "over_head_costs".bold.brightCyan, "product_sales".bold.brightCyan, "total_profit".bold.brightCyan]];
    for (let i = 0; i < results.length; i++) {
      let row = [];
      row.push(results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, (results[i].product_sales - results[i].over_head_costs));
      salesTable.push(row);
    }

    console.log(table(salesTable));
  });
  connection.end();
};

function createNewDepartment() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter department name.",
      validate: function(input) {
        if (input.length < 1) {
          return "You must enter a name";
        }
        else {
          return true;
        }
      }
    },
    {
      name: "costs",
      type: "input",
      message: "Enter overhead costs.",
      validate: function(input) {
        if (input.search(/\D/) !== -1) {
          return "You must enter a valid number";
        }
        else {
          return true;
        }
      }
    },
    {
      name: "sales",
      type: "input",
      message: "Enter any existing product sales.",
      validate: function(input) {
        if (input === "") {
          return true;
        }
        else if (input.search(/\D/) !== -1) {
          return "You must enter a valid number";
        }
        else {
          return true;
        }
      }
    }
  ]).then(function(response) {
    if (response.sales === "") {
      response.sales = 0;
    }
    connection.query(
      `INSERT INTO departments (department_name, over_head_costs, product_sales) VALUES ("${response.name}", "${response.costs}", "${response.sales}")`, function (error, results) {
      // handle errors
      if (error) throw error;
  
      console.log(`\n${response.name.brightCyan} has been added to the departments database.\n`);
    });
  }).then(function(){
    connection.end();
  })
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