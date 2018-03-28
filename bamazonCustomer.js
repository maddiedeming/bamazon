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
var whereClause = "";
// Update Order
function updateOrder(itemId,numberOfUnits,whereClause){
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        if(results.warningCount === 0){
            whereClause = "SELECT PRICE,STOCK_QUANTITY FROM products WHERE ITEM_ID = " + itemId;
            connection.query(whereClause,function(error,results,fields){
                var cost = parseFloat(results[0].PRICE * numberOfUnits).toFixed(2);
                ui.log.write("Cost: $" + cost);
                whereClause = "UPDATE products SET PRODUCT_SALES = " + cost + " WHERE ITEM_ID = " + itemId;
                connection.query(whereClause,function(error,results,fields){
                    if (error) throw error;
                });
                connection.end();
            });
        }
    });
};
// Search Products
function searchProducts(itemId,numberOfUnits){
    whereClause = "SELECT STOCK_QUANTITY FROM products WHERE ITEM_ID = " + itemId;
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        if(results[0] === undefined){
            ui.log.write("Items does not exist!");
        }
        else{
            if(numberOfUnits > results[0].STOCK_QUANTITY){
                ui.log.write("Insufficient quantity!");
            }
            else{
                whereClause = "UPDATE products SET STOCK_QUANTITY = STOCK_QUANTITY - " + numberOfUnits + " WHERE ITEM_ID = " + itemId;
                updateOrder(itemId,numberOfUnits,whereClause);
            }
        }
    });
};
// Get User Input
function getUserInput(){
    ui.log.write("Welcome, Bamazon Customer!");
    ui.log.write("Enter Details Below to Purchase a Product");
    inquirer.prompt([
        {
            type: "input",
            message: "Item ID: ",
            name: "itemId"
        },
        {
            type: "input",
            message: "Number of Units: ",
            name: "numberOfUnits"
        }
    ]).then(function(inquirerResponse){
        var itemId = inquirerResponse.itemId;
        var numberOfUnits = inquirerResponse.numberOfUnits;
        searchProducts(itemId,numberOfUnits);
    });
};
// Get Products
function getProducts(){
    ui.log.write("Items for Sale:");
    whereClause = "SELECT * FROM products";
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        for(var i = 0; i < results.length; i++){
            ui.log.write(results[i].ITEM_ID + " | " + results[i].PRODUCT_NAME + " ($" + results[i].PRICE + ")");
        };
        getUserInput();
    });
};
// Initialize
connection.connect(function(err){
    if (err){throw err};
    getProducts();
});
