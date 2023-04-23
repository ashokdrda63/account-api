var express = require('express');
const fileupload = require("express-fileupload");
require('dotenv').config()
// const { Client } = require('mysql');
// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

var db = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    port : 3306,
    password : 'root',
    database : 'account_plus'
  }
});

var mysql = require('mysql2');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port : 3306,
  database: "account_plus",
  insecureAuth: true
});
const main = require('./controllers/main')

// App
const app = express()


// App Middleware
const whitelist = ['http://localhost:3001','http://localhost:8000','*']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors({origin:true}))//Cross Origin
app.use(cors())//Cross Origin
// app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'
app.options('*', cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.urlencoded({ extended: true }));
// App Routes - Auth
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get('/', (req, res) => res.send('hello world'))


app.get('/crud', (req, res) => main.getTableData(req, res, db))

app.post('/get_seq', (req, res) => main.getMaxSeqNo(con, req, res, db))
app.post('/get_all_accountDes', (req, res) => main.get_all_accountDes(con, req, res))


app.post('/insert_budget', (req, res) => main.insertTableData(req, res, db))
app.post('/insert_account', (req, res) => main.insertTableData(req, res, db))
app.post('/insert_scheme', (req, res) => main.insertTableData(req, res, db))
app.get('/crud', (req, res) => main.getTableData(req, res, db))
app.post('/insert_map', (req, res) => main.insertMapData(con,req, res, db))
app.post('/get_all', (req, res) => {main.getAllRecords(req, res, db)})
app.post('/get_all_scheme_obmaster', (req, res) => main.get_all_scheme_obmaster(req, res, db))
app.post('/insert_acc_budget_map', (req, res) => main.insert_acc_budget_map(req, res, db))
app.post('/insert_obmaster', (req, res) => main.insert_obmaster(req, res, db))

app.post('/insert_family_perticular', (req, res) => main.insert_family_perticular( con,req, res))

app.post('/insert_inword_voucher', (req, res) => main.insert_inWordVoucher( con,req, res))
app.post('/insert_outward_voucher', (req, res) => main.insert_outWordVoucher( con,req, res,db))
// app.post('/insert_outward_voucher', (req, res) => res.json({message:"succcess"}))
app.post('/insert_familyy_perticular', (req, res) => main.insert_familly_perticular( con,req, res))

app.put('/crud', (req, res) => main.putTableData(req, res, db))
app.post('/delete', (req, res) => main.deleteTableData(req, res, con))
app.post('/login', (req, res) => main.loginToken(req, res, db))
app.post('/get_AccountDetails', (req, res) => main.get_AccountDetails(req, res, con))
app.post('/search_house_no', (req, res) => main.searchForHouseNo(con,req, res))

app.post("/upload", (req, res) => {

  const newpath = __dirname + "\\files\\";
  // const newpath = "G:\\application\\upload\\files\\"
  console.log("New Path : "+newpath)
  const file = req.files.file;
  const filename = file.name;
 


  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log(err)
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});


app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running');
});