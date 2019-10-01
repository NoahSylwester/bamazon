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

connection.connect();

connection.query('SELECT * FROM products', function (error, results) {
  // handle errors
  if (error) throw error;

  // will log all ids in for loop below for use later
  var availableIds = [];

  // if no error display all available products
  var itemLog = "";
  // build cleaner strings to display products
  for (let i = 0; i < results.length; i++){
    availableIds.push(results[i].item_id);
    itemLog += `\nID: ${results[i].item_id.toString().green}\nNAME: ${results[i].product_name.brightCyan}\nPRICE: ${results[i].price.toString().yellow}\n`;
  }
  // display parsed results
  console.log(`\nItems for sale:
${itemLog}`);

// prompt user for input
inquirer.prompt([{
  type: "input",
  name: "id",
  message: "Enter the ID of the product you wish to purchase.",
  validate: function(input) {
    if (availableIds.includes(parseInt(input, 10))) {
      return true;
    }
    else {
      return "Not a valid ID.";
    }
  }
}]).then(function(response) {
  // save selected product
  var chosenProduct = results[availableIds.indexOf(parseInt(response.id, 10))];
  // prompt user for amount of chosen product
  inquirer.prompt([{
    type: "input",
    name: "amount",
    message: "How many units do you wish to buy?"
  }]).then(function(response) {
    if (parseInt(response.amount, 10) <= chosenProduct.stock_quantity) {
      var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: chosenProduct.stock_quantity - parseInt(response.amount, 10)
          },
          {
            item_id: chosenProduct.item_id
          }
        ],
        function(err, res) {
          if (err) throw err;
          // return total and thanks
          console.log(`Thanks for shopping at bamazon! Your total is ${("$" + (chosenProduct.price * parseInt(response.amount, 10))).toString().brightGreen}.`);
        }
      );
      var assignment = `product_sales = product_sales + ${(chosenProduct.price * parseInt(response.amount, 10))}`;
      var query = connection.query(
        `UPDATE departments SET ${assignment} WHERE ?`,
        [
          {
            department_name: chosenProduct.department_name
          }
        ],
        function (err, res) {
          if (err) throw err;
        }
      );
    }
    else {
      console.log('Insufficient quantity in stock.');
    }
  }).then(function() {
    // disconnect
    connection.end();
  })
})
});