
1,4 have common goal together --------------------------------------------------- done
2,3,5,6 have similer goal together -------------------------------------------- done

1. User and Role Management
Assumptions:- 

Roles = [Viewer, Analyst, Admin]

Every person is a part of an isolated organisation and only they can access the dashboard

Admin :: one who own the current data and dashbord complete control

Analyst :: works under admin for analysis on database and stastical actions for company and can do basic operation on data

Viewer :: Everyone Except Admin, Analyst

Features to be implement
Admin ::
 1) Assign roles [Analyst, Viewer] By creating new User or upgrade or downgrade their roles or delete them 
 2) Upgrade his own details create upgrade himself or downgrade himself but in that case there should be someone else at admin position



 4) Controling whether a specific user is allowed to login take advantage of their role or not without letting them comprimizing their role
 5) Blocking a specific user to even fatch data to view
Analyst ::
 1) can do tasks with data of dashboard CRUD
 2) can view list of Viewers and also all analyst and even their profile 

Viewers ::
 1) can view dashboard data


6. Sqllite in use

2. 3. Dataset for Dashboard + CRUD + filtering + pagination + Aggregation and ( everything based on role )

5. Validation on data sent to backend as inputd

Extra :
Everyone can Auth as a Common [ Viewers ] Role

Tables Required
