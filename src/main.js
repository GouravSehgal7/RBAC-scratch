import Express from 'express'
import authroute from './routes/auth.route.js'
import userhandlerroute from './routes/user.route.js'
import roleroute from './routes/roles.route.js'
import dashboardroute from './routes/finance.route.js'
const app = Express();

app.use('/api/auth',authroute)
app.use('/api/role/v1',roleroute)
app.use('/api/userhandler',userhandlerroute)
app.use('/api/dashboard',dashboardroute);


export default app