# Stock Simulator

Create custom account, start with \$1000, search, buy and sell stocks. See you profits or your losses.

## Live Link

-

## Usage

To use our web app, simply start by logging in, if you dont have and account you can create one, press the SIGN UP button next to the login button.

Navigate to the search page, search for any stock by name of company or stock name

Once searched the chart will show the history of the stock value

Navigate to the bottom of the page, the name and value of the stock will be displayed. That will allow you to buy or sell stocks.

## Requirements

- Allow user to buy and sell stocks
- Display existing stock in the users portfolio
- Display stock info when the stock is searched(sell price, buy price and chart that shows the stock's value history)
- Store all users, the stocks they have bought and the amount of money the have.

## Technologies Used

- JavaScript
- Jquery
- API's
- Node
- Express
- Materialize
- MVC
-

## Code Explanation

- Our main file, which houses most of the dependencies that we'll be using and the initial server set-up, is server.js
- Models folder holds all the files for Sequelize and building our tables and their column
- Public folder holds all our JS and Jquery files that hold the logic of our app
- Routes folder holds apiRoutes.js and htmlRoutes.js. The apiRoutes.js logic is used for CRUD. The htmlRoutes define the end points in the browser.
