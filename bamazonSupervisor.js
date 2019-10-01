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