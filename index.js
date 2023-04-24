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

function addEmployees() {
    db.query("select * from roles;", function (err, data) {
        if (err) throw err;
        let roleList = data.map(element => ({
            name: element.title,
            value: element.id
        })
        )
        db.query("select * from employee where manager_id is null;", function (err, data) {
            if (err) throw err;
            let managerlist = data.map(element => ({
                name: element.firstName + ', ' + element.lastName,
                value: element.id
            })
            )
            managerlist.push({ name: "I am a Manager", value: null })
            inquirer.prompt([
                {
                    name: 'firstname',
                    type: 'input',
                    message: 'enter first name?'
                },
                {
                    name: 'lastname',
                    type: 'input',
                    message: 'enter last name?'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'enter role id?',
                    choices: roleList
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'enter manager id?',
                    choices: managerlist
                }
            ]).then(function (answer) {
                db.query(
                    'INSERT INTO employee SET ?',
                    {
                        firstName: answer.firstname,
                        lastName: answer.lastname,
                        role_id: answer.role_id,
                        manager_id: answer.manager_id,
                    }
                    , function (err, res) {
                        if (err) throw err;
                        console.log('new role has been added');
                        startMenu();
                    })
            })
        })
    })
    };