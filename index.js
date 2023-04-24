const inquirer = require("inquirer")
const mysql = require("mysql2")
require("dotenv").config()
require("console.table")

const db = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employeeTracker_db'
})

db.connect(function (err) {
    if (err) throw err;
    console.log('Welcome to Employee tracker')
    starMenu()
})

function starMenu() {
    inquirer.createPromptModule([
        {
            type: "list",
            message: "please choose an option",
            choices: ["View Employees", "view Department", "View Roles", "Add Department", "Add roles", "Add employees", "update Roles", "quit"],
            name: "selection"
        }
    ]).then(({selection}) => {
        switch (selection) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Department":
                viewDepartment();
                break;
            case "view Roles":
                viewRoles();
            case "Add Department":
                addDepartment();
                break;
            case "Add roles":
                addRoles();
                break;
            case "Add employees":
                addEmployees();
                break;
            case "update Roles":
                updateRoles();
                break;
            case "quit":
                db.end()
                process.exit(0)
        }
    })
}

function viewRoles(){
    db.query("select r.id,r.title,r.salary,e.id,e.firtName,e.lastname from roles r left join employee e on e.role_id = r.ride;",function(err,data){
        if(err) throw err;
        console.table(data)
        starMenu()
})
}

function viewDepartment(){
    db.query("select d.id,d.name, r.title,r.salary from department d right join roles r on d.id = r.department_id order by d.name;",
        function(err,data){
        console.table(data)
        starMenu()
})
}

function viewEmployees(){
    db.query("select e.id,e.firstName,e.lastName, r.id,r.title,r.salary,d.id,d.name from employee e left join roles r on e.role_id = r.id left join department d on r.department_id = d.id;",function(err,data){
        if(err) throw err;
        console.table(data)
        starMenu()
})
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'Which department would you like to add?'
        }
    ]).then(function (answer) {
        db.query(
            'INSERT INTO department SET ?',
            {
                name: answer.newDepartment
            }
            , function (err, res) {
                if (err) throw err;
                console.log('Your department has been added!');
                startMenu();
            })
    })
};