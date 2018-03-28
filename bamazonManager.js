// Global Variables
require("dotenv").config();
const inquirer = require("inquirer");
const ui = new inquirer.ui.BottomBar();
const mysql = require("mysql");
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : 'bamazon'
});
const questions = [
    {
        type: "list",
        message: "Select a Menu Option: ",
        name: "menuOptions",
        choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
    },
    {
        type: "checkbox",
        message: "Select Item(s): ",
        name: "selectItem",
        choices: []
    },
    {
        type: "input",
        message: "",
        name: "inputQuantity"
    },
    {
        type: "input",
        message: "Product Name: ",
        name: "inputProductName"
    },
    {
        type: "input",
        message: "Department Name: ",
        name: "inputDepartmentName"
    },
    {
        type: "input",
        message: "Price: ",
        name: "inputPrice"
    }
];
var whereClause = "";
var inputValues = [];
// Initialize
connection.connect(function(err){
    if (err){throw err};
    promptUser();
});
// Prompt User
function promptUser(){
    ui.log.write("Welcome, Bamazon Manager!");
    inquirer.prompt(questions[0]).then(function(inquirerResponse){
        var optionSelected = inquirerResponse.menuOptions;
        if(optionSelected !== null || optionSelected !== undefined ||optionSelected !== "" ){
            switch(optionSelected){
                case "View Products for Sale":
                    whereClause = "SELECT * FROM products;";
                    searchQuery(whereClause,optionSelected);
                    closeConnection();
                    break;
                case "View Low Inventory":
                    whereClause = "SELECT * FROM products WHERE STOCK_QUANTITY < 5;";
                    searchQuery(whereClause,optionSelected);
                    closeConnection();
                    break;
                case "Add to Inventory":
                    whereClause = "SELECT ITEM_ID,PRODUCT_NAME FROM products;";
                    searchQuery(whereClause,optionSelected);
                    break;
                case "Add New Product":
                inquirer.prompt(questions[3]).then(function(inquirerResponse){
                    var productName = inquirerResponse.inputProductName;
                    inquirer.prompt(questions[4]).then(function(inquirerResponse){
                        var departmentName = inquirerResponse.inputDepartmentName;
                        inquirer.prompt(questions[5]).then(function(inquirerResponse){
                            var price = inquirerResponse.inputPrice;
                            questions[2].message = "Quantity: ";
                            inquirer.prompt(questions[2]).then(function(inquirerResponse){
                                var quantity = inquirerResponse.inputQuantity;
                                whereClause = "INSERT INTO products(PRODUCT_NAME,DEPARTMENT_NAME,PRICE,STOCK_QUANTITY) VALUES('" + productName + "','" + departmentName + "'," + price + "," + quantity + ");";
                                updateQuery(whereClause);
                                closeConnection();
                            });
                        });
                    });
                });
            }
        }
    });
};
// Search Query
function searchQuery(whereClause,optionSelected){
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        if(results.length > 0){
            if(optionSelected === "View Products for Sale" || optionSelected === "View Low Inventory"){
                for(var i = 0; i < results.length; i++){
                    ui.log.write(`${results[i].ITEM_ID}.${results[i].PRODUCT_NAME} ($${results[i].PRICE})\t| Department:\t${results[i].DEPARTMENT_NAME}\t| Quantity: ${results[i].STOCK_QUANTITY}`);
                }          
            }
            else{
                if(optionSelected === "Add to Inventory"){
                    for(var i = 0; i < results.length; i++){
                        questions[1].choices.push(results[i].ITEM_ID + ". " + results[i].PRODUCT_NAME);
                    }
                    inquirer.prompt(questions[1]).then(function(inquirerResponse){
                        var length = inquirerResponse.selectItem.length;
                        if(length > 0){
                            var products = inquirerResponse.selectItem;
                            inputValue(0,length,products);
                        }
                    });
                }
            }
        }
        else{
            ui.log.write(`Product(s) not found.`);
        }
    });
};  
// Input Value
function inputValue(i,length,products){
    if(i < length){
        questions[2].message = "Add Quantity to " + products[i] + ": ";
        inquirer.prompt(questions[2]).then(function(inquirerResponse){
            inputValues.push(inquirerResponse.inputQuantity)
            i++;
            inputValue(i,length,products);
        });
    }
    else{
        for(var i = 0; i < products.length; i++){
            var index = products[i].indexOf(".");
            var itemId = products[i].substring(0,index);
            var query = "UPDATE products SET STOCK_QUANTITY = STOCK_QUANTITY + " + parseInt(inputValues[i]) + " WHERE ITEM_ID = " + itemId;
            updateQuery(query);
        }
        closeConnection();
    }
};
// Update Query
function updateQuery(whereClause){
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        if(results.affectedRows > 0){
            ui.log.write("Product updated!");
        }
    });
};
// Close Connection
function closeConnection(){
    connection.end();
};
