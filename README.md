# bamazon
## Overview
In this activity, you'll be creating an Amazon-like storefront with the MySQL skills you learned this week. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.
## Dependencies
* dotenv
* inquirer
* mysql
## Installation
### Install Locally
```
git clone https://github.com/maddiedeming/bamazon.git
cd bamazon/
npm install
```
### Setup Database
```
mysql -u <Your MySQL Username> -p
<Your MySQL Password>
\. schema.sql
\. seeds.sql
\q
```
### .env File
1. Create a new file and save as ".env" in the root directory.
2. Copy and paste the following into the .env file:
```
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=password
```
3. Edit any of the values in the brackets above to coordinate with your MySQL Database.
## Commands
### Customer
```
node bamazonCustomer.js
```
### Manager
```
node bamazonManager.js
```
### Supervisor
```
node bamazonSupervisor.js
```
## Requirements
### Customer (Minimum)
- [x] Create a MySQL Database called `bamazon`.
- [x] Then create a Table inside of that database called `products`.
- [x] The `products` table should have each of the following columns:
  - [x] `ITEM_ID` (Unique ID for each Product)
  - [x] `PRODUCT_NAME` (Name of Product)
  - [x] `DEPARTMENT_NAME` (Name of Department where Product resides)
  - [x] `PRICE` (Cost to Customer)
  - [x] `STOCK_QUANTITY` (How much of the Product is available)
- [x] Populate this database with around 10 different products.
- [x] Create a Node application called `bamazonCustomer.js`. 
  - [x] Running this application will first display all of the items available for sale. 
  - [x] Include the ids, names, and prices of products for sale.
- [x] The app should then prompt users with two messages:
  - [x] The first should ask them the ID of the product they would like to buy.
  - [x] The second message should ask how many units of the product they would like to buy.
- [x] Once the Customer has placed the order, your application should check if your store has enough of the product to meet the Customer's request.
  - [x] If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
  - [x] However, if your store does have enough of the product, you should fulfill the Customer's order.
    - [x] This means updating the SQL database to reflect the remaining quantity.
    - [x] Once the update goes through, show the Customer the total cost of their purchase.
### Manager (Next Level)
- [x] Create a Node application called `bamazonManager.js`.
- [x] The app should then prompt users with a list of menu options:
  - [x] `View Products for Sale`
    - [x] List every available item: Item IDs, Names, Prices, and Quantities.
  - [x] `View Low Inventory`
    - [x] List all items with an inventory count lower than five.
  - [x] `Add to Inventory`
    - [x] Allow the Manager to "add more" of any item currently in the store.
  - [x] `Add New Product`
    - [x] Allow the Manager to add a completely new Product to the store.
### Supervisor (Final Level)
- [x] Create a new MySQL table called departments. Your table should include the following columns:
  - [x] `DEPARTMENT_ID` (Unique ID for each Department)
  - [x] `DEPARTMENT_NAME` (Name of Department)
  - [x] `OVER_HEAD_COSTS` (A dummy value you set for each Department)
- [x] Update Previous Application
  - [x] Modify the `products` table so that there's a `PRODUCT_SALES` column.
  - [x] Modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.
  - [x] Modify the `bamazonCustomer.js` app so that when a Customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's `PRODUCT_SALES` column.
  - [x] Make sure your app still updates the `STOCK_QUANTITY` listed in the `products` table.
- [x] Create a Node application called `bamazonSupervisor.js`. 
- [x] The app should then prompt users with a list of menu options:
  - [x] View Product Sales by Department
    - [x] Display a summarized Table. Use the Table below as a Guide:

    | DEPARTMENT_ID   | DEPARTMENT_NAME   | OVER_HEAD_COSTS   | PRODUCT_SALES   | TOTAL_PROFIT   |
    | --------------: | ----------------- | -----------------:| --------------: | --------------:|
    | 01              | Electronics       | 10000             | 20000           | 10000          |
    | 02              | Clothing          | 60000             | 100000          | 40000          |

    - [x] The `TOTAL_PROFIT` column should be calculated on the fly using the difference between `OVER_HEAD_COSTS` and `PRODUCT_SALES`. `TOTAL_PROFIT` should not be stored in any database. You should use a custom alias.
  - [x] Create New Department
      - [x] Allow the Supervisor to add a completely new Department to the store.
