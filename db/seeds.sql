USE employeeTracker_db;


INSERT INTO DEPARTMENT(NAME) VALUES ("IT"),("Sales"),("Production");

INSERT INTO ROLES(TITLE,SALARY, department_id) VALUES
('Manager of IT',120000,1),
('Sales Manager',100000,1),
('Production Manager',100000,2);

INSERT INTO employee(FIRSTNAME,LASTNAME,ROLE_ID)
VALUES
('JOHN', 'Potter',1),
('NANCY', 'ROBENSON',2),
('ALMA', 'JOHNSON',3);