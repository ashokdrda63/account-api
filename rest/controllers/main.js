const getTableData = (req, res, db) => {
    db.select('*').from('budget_master')
      .then(items => {
        if (items.length) {
          res.json(items)
        } else {
          res.json({ dataExists: 'false' })
        }
      })
      .catch(err => res.status(400).json({ dbError: err }))
  }

  

   const getAllRecords = (req, res, db) => {
     const {table_name} = req.body
     db.select('*').from(table_name+'_master')
     .then(items => {
        console.log('inside all record +++', items)
        if (items.length) {
          res.json(items)
        } else {
          res.json([])
        }
      })
      .catch(err => res.status(400).json({ dbError: err }))
   }
  
   
   const get_all_scheme_obmaster = (req, res, db) => {
    const {table_name} = req.body
      db.select('id','name').from(table_name+'_master')
      .then(items => {
        if (items.length) {
          res.json(items)
        } else {
          res.json([])
        }
      })
      .catch(err => res.status(400).json({ dbError: err }))
   }

  const insertTableData = (req, res, db) => {
    const { id, name,created_by,modified_by, table_name} = req.body
    const added = new Date()
    // console.log("Inside save method---"+JSON.stringify(req.body))
    db(table_name+'_master').insert({id,name,created_by,modified_by})
      .returning('*')
      .then(item => { 
        res.json({ "status": "SUCCESS" })
      })
      .catch(err => res.status(400).json({ dbError: err.message }))
  }

  const insert_acc_budget_map = (req, res, db) => {
    const { acc_id, acc_name,budget_id,budget_name,table_name} = req.body
    db(table_name+'_master').insert({ acc_id, acc_name,budget_id,budget_name})
      .returning('*')
      .then(item => {
        db.select('*').from(table_name+'_master')
      .then(items => {
        if (items.length) {
          res.json(items)
        } else {
          res.json({ dataExists: 'false' })
        }
      })
      .catch(err => res.status(400).json({ dbError: err }))
      })
      .catch(err => res.status(400).json({ dbError: err.message }))
  }
  
  const insert_outWordVoucher =(con,req,res,db)=>{
  const{Scheme_name,VchType,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,Amount_rec,Amount_pay,table_name}  = req.body;
  db(table_name).insert({Scheme_name,VchType,Vch_date,Chq_no,Chq_date,Bank_name,Vch_desc,Amount_rec,Amount_pay})
  .returning("*")
  .then(item=>{
    res.json("Record Inserted")
  })
  .catch(err=> res.status(400).json({ dbError: err.message }))
  // res.json({message:"success"})
 }
  
  const insert_obmaster = (req, res, db) => {
    const { scheme_id,scheme_name,budget_id,budget_name,acc_id, acc_name,amt_pay,amt_rec,table_name} = req.body
    // console.log(JSON.stringify(req.body)+"---console")
    db(table_name+'_master').insert({ scheme_id,scheme_name,budget_id,budget_name,acc_id, acc_name,amt_pay,amt_rec})
      .returning('*')
      .then(item => {
        db.select('*').from(table_name+'_master')
      .then(items => {
        if (items.length) {
          res.json(items)
        } else {
          res.json({ dataExists: 'false' })
        }
      })
      .catch(err => res.status(400).json({ dbError: err }))
      })
      .catch(err => res.status(400).json({ dbError: err.message }))
  }


  const get_all_accountDes = (con, req, res) => {
    console.log(req.body)
    const {scheme_name,voucher_type,to_from} = req.body
    //const qry = "select acc_id, acc_name from account_plus.obmaster_master  where scheme_name='"+scheme_name+"'"

var qry = ""

  if(voucher_type == "BR" && to_from == "to")
    qry = "select acc_id, acc_name from account_plus.obmaster_master "+
    " where scheme_name='"+scheme_name+"' and budget_name = 'BANK'"
  
  else if(voucher_type == "BR" && to_from == "from")
  qry = "select acc_id, acc_name from account_plus.acc_budget_map_master where "+ 
            " budget_name ='INCOME'"

  else if(voucher_type == "CR" && to_from == "to")
    qry = "select acc_id, acc_name from account_plus.obmaster_master where "+ 
              "scheme_name ='"+scheme_name+"' and budget_name ='CASH-IN-HAND'"
  
    else if(voucher_type == "CR" && to_from == "from")
   qry = "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
            "budget_name = 'INCOME'"
  
   else if(voucher_type == "BP" && to_from == "to")
    qry = "SELECT acc_name FROM account_plus.acc_budget_map_master where " +
              "budget_name = 'EXPENDITURE' or budget_name = 'ADVANCE' or budget_name = 'LIBILITIES'"
  
    else if(voucher_type == "BP" && to_from == "from")
    qry = "select acc_id, acc_name from account_plus.obmaster_master where "+ 
              "scheme_name ='"+scheme_name+"' and budget_name ='BANK'"
  else qry = ""
    console.log("Qry : "+qry)
    con.connect(function(err) {
     con.query(qry, function (err, result, fields) {
       if(result.length > 0){
         console.log("Record Present..")
         res.json(result)
       } 
       else{
         console.log(result+"--result")
         res.json([])
       }
     });
   });
   }

  const get_AccountDetails = (req, res, con) => {
   const {table_name,budget_name} = req.body
  //  console.log(budget_name+"---------");
   const qry = "select acc_id, acc_name from account_plus.acc_budget_map_master where budget_name='"+budget_name+"'"
   con.connect(function(err) {
    con.query(qry, function (err, result, fields) {
      if(result.length > 0){
        console.log("Record Present..")
        res.json(result)
      } 
      else{
        console.log(result+"--result")
        res.json([])
      }
    });
  });
  }

  const insertMapData = (con,req, res, db) => {
    console.log(JSON.stringify(req.body))
    const { budget_id,account_id} = req.body
    const added = new Date()
    const qry = "SELECT count(1) as cnt FROM budget_account_sync where budget_id='"+budget_id+"' and account_id='"+account_id+"'"
    const insertQuery = "INSERT INTO budget_account_sync values('"+budget_id+"','"+account_id+"')"
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if(result[0].cnt > 0) 
        res.json("Record Present")
        else{
         insertRecordToDB(con, insertQuery)
         res.json("Data Inserted")
        }
      });
    });
  }


  const insert_family_perticular = (con,req, res, db) => {
    // console.log(JSON.stringify(req.body))
  const items = req.body
    con.connect(function(err) {
      con.query(
        'INSERT INTO family_perticulars (name, age, gender, salary, houseNo) VALUES ?',
        [items.map(item => [item.name, item.age, item.gender, item.salary, item.houseNo])],
        (error, results) => {
          console.log(error)
        }
    );
    });
  }

  const insert_inWordVoucher =(con,req, res)=>{
    const items =req.body;
    con.connect(function(err){
      con.query(
        'INSERT INTO inword_vchentry (scheme_name,account_desc,amount_rec,amount_pay,vch_ty,vchno) VALUES ?',
        [items.map(item => [item.scheme_name, item.accountDesName, item.accountFrom, item.accountTo, item.accountTy,item.vch_no])],
        (error, results) => {
          if (results?.insertId >0){
            res.json("Record Inserted")
          }
        }
    );
  })
  }

  const insert_familyy_perticular = (con,req, res, db) => {
  const items = req.body
    con.connect(function(err) {
      con.query(
        'INSERT INTO school_status (fname, age, gender, salary, rollno) VALUES ?',
        [items.map(item => [item.fname, item.age, item.gender, item.salary, item.rollno])],
        (error, results) => {
          console.log(error)
        }
    );
    });
  }

  const searchForrollno = (con,req, res) => {
    const rollno = req.body
    console.log(JSON.stringify(rollno))
    const qry = "SELECT * from school_status where rollno = '"+rollno.rollno+"'"
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if (err) throw err;
        res.json(result)
      });
    });
  }

  const getMaxSeqNo = (con, req, res, db) => {
    const {table_name} = req.body
    const qry = "select max(seq_no) as max_seq from "+table_name+"_master"
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if (err) throw err;
        res.json(result)
      });
    });
   
   }

   const searchForHouseNo = (con,req, res) => {
    console.log(req.body)
    const houseNo = req.body
    // console.log(JSON.stringify(houseNo))
    const qry = "SELECT * from family_perticulars where houseNo = '"+houseNo.house_no+"'"
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if (err) throw err;
        res.json(result)
        console.log(res)
      });
    });
  }

  const insertRecordToDB=(con, qry) => {
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if (err) throw err;
        
      });
    });
  }

  
  const putTableData = (req, res, db) => {
    const { id, song_title, movie_album, singers, song_length, genre, song_url } = req.body
    db('songlist').where({ id }).update({ song_title, movie_album, singers, song_length, genre, song_url })
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({ dbError: 'db error' }))
  }
  
  const deleteTableData = (req, res, con) => {
    const { budget_id,acc_id,table_name} = req.body
    console.log("Budget Id :"+budget_id)
    console.log("Account Id :"+acc_id)
    console.log(JSON.stringify(req.body))
    
    const qry = "delete  FROM "+table_name+"_master where budget_id='"+budget_id+"' and acc_id='"+acc_id+"'"
    console.log(qry)
    con.connect(function(err) {
      con.query(qry, function (err, result, fields) {
        if (err!=''){console.log(err)}

        const qry1 = "select * from "+table_name+"_master"
        con.query(qry1, function (err, result, fields) {
          if (err!=''){console.log(err)}
          res.json(result)
        });
      });
    });
  }
  
  const loginToken = (req, res, db) => {
    const { userid, password } = req.body
    db('usertable').where({ userid }).where({password})
    .then(item => {
      if(item.length==1){
        res.json({token: userid+password,dataExists: 'true'})
      }else(
        res.json({ dataExists: 'false' })
        )
      })
      .catch(err => res.status(400).json({ dbError: err }))
    }
    
   

    module.exports = {
      getTableData,
      //postBudgetTableData,
      insertTableData,
      putTableData,
      deleteTableData,
      loginToken,
      getMaxSeqNo,
      getAllRecords,
      insertMapData,
      //postSchemeTableData,
      insert_acc_budget_map,
      get_AccountDetails,
      insert_obmaster,
      insert_inWordVoucher,
      insert_family_perticular,
      get_all_accountDes,
      get_all_scheme_obmaster,
      searchForHouseNo,
      insert_outWordVoucher ,
    }
    // const postSchemeTableData = (req, res, db) => {
    //   const { scheme_id,scheme_name,created_by,modified_by} = req.body
    //   const added = new Date()
    //   console.log("Inside save method---"+req.body)
    //   db('account_master').insert({scheme_id,scheme_name,created_by,modified_by})
    //     .returning('*')
    //     .then(item => {
    //       res.json({ "status": "SUCCESS" })
    //     })
    //     .catch(err => res.status(400).json({ dbError: err.message }))
    // }
  
    // const postBudgetTableData = (req, res, db) => {
    //   const {budget_id,budget_name,created_by,modified_by} = req.body
    //   const added = new Date()
    //   console.log("Inside save method---"+req.body)
    //   db('Budget_master').insert({budget_id,budget_name,created_by,modified_by})
    //     .returning('*')
    //     .then(item => {
    //       res.json({ "status": "SUCCESS" })
    //     })
    //     .catch(err => res.status(400).json({ dbError: err.message }))
    // }
//-----------------------------------------------------------------------------------

    /*
select * from account_plus.family_perticulars a 
join account_plus.family_head b on 
a.houseNo = b.idfamily_head;
    */