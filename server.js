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

connection.connect(function (err) {
  if (err) throw err;
  runTracker();
});

function runTracker() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add a department",
          "Add a role",
          "Add an employee",
          "View departments",
          "View roles",
          "View employees",
          "Update employee role",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "View departments":
          viewDepartment();
          break;

        case "View roles":
          viewRole();
          break;

        case "View employees":
          viewEmployee();
          break;

        case "Update employee role":
          update();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDept",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        name: answer.newDept,
      });
      const query = "SELECT * FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runTracker();
      });
    });
}
function addRole() {
  connection.query("SELECT * FROM role", function (err, roles) {
    connection.query("SELECT * FROM department", function (err, departments) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What role would you like to add?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
          },
          {
            name: "choice",
            type: "rawlist",
            choices: function () {
              var deptArray = [];
              for (var i = 0; i < departments.length; i++) {
                deptArray.push(departments[i].name);
              }
              return deptArray;
            },
            message: "What department does this role fall under?",
          },
        ])
        .then(function (result) {
          for (let i = 0; i < departments.length; i++) {
            if (departments[i].name == result.choice) {
              result.department_id = departments[i].id;
            }
          }
          var query = "INSERT INTO role SET ?";
          const values = {
            title: result.newRole,
            salary: result.salary,
            department_id: result.department_id,
          };
          connection.query(query, values, function (err) {
            if (err) throw err;
            console.table("Role was added");
            runTracker();
          });
        });
    });
  });
}
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var rolesArray = [];
            for (var i = 0; i < res.length; i++) {
              rolesArray.push(res[i].title);
            }
            return rolesArray;
          },
          message: "What is the employee's role?",
        },
      ])
      .then(function (newEmployee) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].title === newEmployee.choice) {
            newEmployee.role_id = res[i].id;
          }
        }
        var query = "INSERT INTO employee SET ?";
        const values = {
          first_Name: newEmployee.firstName,
          last_Name: newEmployee.lastName,
          role_id: newEmployee.role_id,
        };
        connection.query(query, values, function (err, res) {
          if (err) throw err;
          console.log("Employee was added");
          runTracker();
        });
      });
  });
}

function viewRole() {
  const query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("All roles:");
    console.table(res);
    runTracker();
  });
}
function viewEmployee() {
  const query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("All employees:");
    console.table(res);
    runTracker();
  });
}
