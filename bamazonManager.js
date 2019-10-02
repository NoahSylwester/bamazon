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

// store department names
var departments = [];


function viewProducts() {
  connection.query('SELECT * FROM products', function (error, results) {
    // handle errors
    if (error) throw error;
  
    // if no error display all available products
    var itemLog = "";
    // build cleaner strings to display products
    for (let i = 0; i < results.length; i++){
      itemLog += `\nID: ${results[i].item_id.toString().green}\nNAME: ${results[i].product_name.brightCyan}\nPRICE: ${results[i].price.toString().yellow}\nQUANTITY: ${results[i].stock_quantity.toString().red}\n`;
    }
    // display parsed results
    console.log(`\nItems for sale:
  ${itemLog}`);
  isContinue();
  });
};

function viewLowInventory() {
  inquirer.prompt([{
    type: "number",
    name: "limit",
    message: "Enter a maximum item quantity limit to display (default is 5)."
  }]).then(function(response) {
    // assert default if nothing or something invalid is entered
    var limit;
    if (isNaN(response.limit)) {
      limit = 5;
    }
    else {
      limit = response.limit;
    }
    connection.query(`SELECT * FROM products WHERE stock_quantity <= ${limit}`, function (error, results) {
      // handle errors
      if (error) throw error;
    
      // if no error display all available products
      var itemLog = "";
      // build cleaner strings to display products
      for (let i = 0; i < results.length; i++){
        itemLog += `\nID: ${results[i].item_id.toString().green}\nNAME: ${results[i].product_name.brightCyan}\nPRICE: ${results[i].price.toString().yellow}\nQUANTITY: ${results[i].stock_quantity.toString().red}\n`;
      }
      // display parsed results
      console.log(`\nLow inventory (limit ${limit} units):
    ${itemLog}`);
    isContinue();
    });
  })
};

function addToInventory() {
  connection.query('SELECT * FROM products', function (error, results) {
    // handle errors
    if (error) throw error;

    // will log all ids in for loop below for use later
    var availableIds = [];

    // if no error display all available products
    var itemLog = "";
    // build cleaner strings to display products
    for (let i = 0; i < results.length; i++) {
      availableIds.push(results[i].item_id);
      itemLog += `\nID: ${results[i].item_id.toString().green}\nNAME: ${results[i].product_name.brightCyan}\nPRICE: ${results[i].price.toString().yellow}\nQUANTITY: ${results[i].stock_quantity.toString().red}\n`;
    }
    // display parsed results
    console.log(`\nItems to update:
  ${itemLog}`);

    // prompt user for input
    inquirer.prompt([{
      type: "input",
      name: "id",
      message: "Enter the ID of the product you wish to update.",
      validate: function (input) {
        if (availableIds.includes(parseInt(input, 10))) {
          return true;
        }
        else {
          return "Not a valid ID.";
        }
      }
    }]).then(function (response) {
      // save selected product
      var chosenProduct = results[availableIds.indexOf(parseInt(response.id, 10))];
      // prompt user for amount of chosen product
      inquirer.prompt([{
        type: "input",
        name: "amount",
        message: "How many units should be added?",
        validate: function(input) {
          if (input.search(/\D/) !== -1 || input === '') {
            return "You must enter a valid number";
          }
          else {
            return true;
          }
        }
      }]).then(function (response) {
        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: chosenProduct.stock_quantity + parseInt(response.amount, 10)
            },
            {
              item_id: chosenProduct.item_id
            }
          ],
          function (err, res) {
            if (err) throw err;
            // return total and thanks
            console.log(`${chosenProduct.product_name} has been updated. The new quantity is ${(chosenProduct.stock_quantity + parseInt(response.amount, 10)).toString().green}.`);
            isContinue();
          }
        );
      })
    })
  });
}

function addNewProduct() {
  connection.query('SELECT department_name FROM departments', function (error, results) {
    // handle errors
    if (error) throw error;
  
    for (let i = 0; i < results.length; i++){
      departments.push(results[i].department_name);
    }
  });
  inquirer.prompt([
  {
    name: "name",
    type: "input",
    message: "Enter product name.",
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
    name: "dept",
    type: "input",
    message: "Enter department name.",
    validate: function(input) {
      if (departments.includes(input)) {
        return true;
      }
      else {
        console.log(`\n  ${departments.join('\n  ').brightCyan}`);
        return "Not a valid department name. Please choose from the list above."
      }
    }
  },
  {
    name: "price",
    type: "input",
    message: "Enter price per unit.",
    validate: function(input) {
      if (input.search(/\D/) !== -1 || input === '') {
        return "You must enter a valid number";
      }
      else {
        return true;
      }
    }
  },
  {
    name: "quantity",
    type: "input",
    message: "Enter number of units.",
    validate: function(input) {
      if (input.search(/\D/) !== -1 || input === '') {
        return "You must enter a valid number";
      }
      else {
        return true;
      }
    }
  }
]).then(function(response) {
  connection.query(
    `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${response.name}", "${response.dept}", "${response.price}", "${response.quantity}")`, function (error, results) {
    // handle errors
    if (error) throw error;

    console.log(`\n${response.name.brightCyan} has been added to the products database.\n`);
    isContinue();
  });
})
}

function isContinue() {
  inquirer.prompt([{
    type: 'confirm',
    name: 'answer',
    message: "Would you like to execute another command?"
  }]).then(function(res) {
    if (res.answer) {
      homeInterface();
    }
    else {
      // disconnect
      connection.end();
    }
  });
}

connection.connect();

function homeInterface() {
  inquirer.prompt([{
    type: "list",
    name: "action",
    message: "Select an action",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]
  }]).then(function (response) {
    switch (response.action) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
    }
  });
}

homeInterface();