// Global Variables
require("dotenv").config();
const inquirer = require("inquirer");
const ui = new inquirer.ui.BottomBar();
const mysql = require("mysql");
const connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "password",
    database : "bamazon"
});
const questions = [
    {
        type: "list",
        message: "Select a Menu Option: ",
        name: "menuOptions",
        choices: ["View Product Sales by Department","Create New Department"]
    },
    {
        type: "input",
        message: "Department Name: ",
        name: "departmentName"
    },
    {
        type: "input",
        message: "Overhead Costs: ",
        name: "overheadCosts"
    }
]
var whereClause = "";
// Initialize
connection.connect(function(err){
    if (err){throw err};
    promptUser();
});
// Prompt User
function promptUser(){
    ui.log.write("Welcome, Bamazon Supervisor!");
    inquirer.prompt(questions[0]).then(function(inquirerResponse){
        var optionSelected = inquirerResponse.menuOptions;
        if(optionSelected !== null || optionSelected !== undefined ||optionSelected !== "" ){
            switch(optionSelected){
                case "View Product Sales by Department":
                    whereClause = `SELECT d.DEPARTMENT_ID,d.DEPARTMENT_NAME,d.OVER_HEAD_COSTS,
                    SUM(p.PRODUCT_SALES) AS PRODUCT_SALES,
                    SUM(p.PRODUCT_SALES) - d.OVER_HEAD_COSTS AS TOTAL_PROFIT 
                    FROM departments d 
                    JOIN products p ON d.DEPARTMENT_NAME=p.DEPARTMENT_NAME 
                    GROUP BY d.DEPARTMENT_NAME 
                    ORDER BY DEPARTMENT_ID;`
                    searchQuery(whereClause,optionSelected);
                    closeConnection();
                    break;
                case "Create New Department":
                inquirer.prompt(questions[1]).then(function(inquirerResponse){
                    var departmentName = inquirerResponse.departmentName;
                    inquirer.prompt(questions[2]).then(function(inquirerResponse){
                        var overheadCosts = inquirerResponse.overheadCosts;
                        whereClause = `INSERT INTO departments(DEPARTMENT_NAME,OVER_HEAD_COSTS) 
                        VALUES('${departmentName}',${overheadCosts});`;
                        insertQuery(whereClause);
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
            for(var i = 0; i < results.length; i++){
                ui.log.write(`${results[i].DEPARTMENT_ID}.${results[i].DEPARTMENT_NAME}\tOverhead Costs: $${results[i].OVER_HEAD_COSTS}\t| Product Sales: $${results[i].PRODUCT_SALES}\t| Total Profit: $${results[i].TOTAL_PROFIT}`);
            }
        }
        else{
            ui.log.write(`Product(s) not found.`);
        }
    });
};
// Insert Query
function insertQuery(whereClause){
    connection.query(whereClause,function(error,results,fields){
        if (error) throw error;
        if(results.affectedRows > 0){
            ui.log.write(`Department created!`);
        }
    })
    closeConnection();
};
// Close Connection
function closeConnection(){
    connection.end();
};
