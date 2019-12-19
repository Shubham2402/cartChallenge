const express=require('express');
const app = express();
 const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path = require('path');
const cors = require ('cors') ;
const glob = require ('glob');
const port=process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var db=mongoose.connection;  
db.on('error',console.error.bind(console,'mongodb'));
db.once('open', () => console.log('database created'));

app.use(express.static(path.join(__dirname, '../uploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  let initRoutes = () => {
    // including all routes
    glob("./routes/*.js", {cwd: path.resolve(path.join(__dirname))}, (err, routes) => {
      if (err) {
        console.log("Error occured including routes");
        return;
      }
      routes.forEach((routePath) => {
        console.log(routePath)
        require(routePath).getRouter(app); 
      });
      console.log("included " + routes.length + " route files");
    });
  }
  
  initRoutes();
app.listen(port,()=>{
	console.log('Server Started and running on port 3000');
});
