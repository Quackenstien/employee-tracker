//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

//Creating connection
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employee_trackerDB",
});

//Calling the prompts after the connection is ran
connection.connect(function (err) {
  if (err) throw err;
  runTracker();
});

//Displaying the prompts to the user in the terminal
function runTracker() {
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "add an employee",
        "View a department",
        "View a role",
        "View an employee",
        "Update employee role",
        "Exit",
      ],
    },
  ]);
}
