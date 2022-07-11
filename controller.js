// ===================dependies=============================
const express = require("express");
require("ejs");
const bodyParser = require("body-parser");
const model = require('./model.js');   //include model of app 
// ===================dependies   end=============================



// =====================creat app=====================
const app = express();
app.use(express.static("public"));
app.use(express.json());

app.listen(8000, () => {
    console.log("port started at 8000");
});
	

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// =====================created app=====================


// ============================get request Routing================================

app.get("/", (_, res) => {
    res.render("index");
})


// ============================Routing  end  ================================



// ===================================app logic===============
app.post("/register", async function (req, res)  {

// console.log(typeof req.body.contactno);
// all data including contactno in coming is string to convert into int use parseint
if(typeof req.body.contactno=="string"){
	let contactno_lenth=req.body.contactno.length;
	req.body.contactno=parseInt(req.body.contactno);
}
	let error="";

	if(!req.body.name || !req.body.email || !req.body.password || !req.body.contactno || !req.body.position){
		error="Please fill all data";
	}else if(typeof req.body.contactno!="number"  || req.body.contactno.toString().length!=10){
		error="Please fill Contactno in format";
	}
	else if(!req.body.email.match( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
		error="Please fill Email in format";
	}


	if(req.body._id){

		if(error){
			res.render('employee',{status:error,data:req.body});
		}else{
			let return_value = await model.update_in_database(req);
			let data = await model.fetch_in_database(req);
	
			if(typeof return_value=="object" && return_value.modifiedCount>0){
				res.render('employee',{status:'Successfuly updated',data:data});
			}else{
				res.render('employee',{status:"Something went wrong",data:data});
			}
			
		}

	}else {

		if(error){
			res.render('index',{error:error});
		}else{
	
			let return_value = await model.save_in_database(req);

			if(typeof return_value=="object"){
				
				res.render('employee',{data:return_value});
			}else{
				res.render('index',{error:"Please try another Email"});
			}
		}
	}
})


app.post("/dash", async (req, res) => {
	
	let return_value = await model.fetch_in_database(req);
	if(return_value.password==req.body.password){
		
			res.render('employee',{data:return_value});
	}else{
		res.render('index',{error:"Wrong validation"});
	}
	

})


app.post("/details", async (req, res) => {
	
	let return_value = await model.fetchall_in_database();
	res.render("manager",{all_data:return_value})
	

})

app.post("/Manager", async (req, res) => {
	
	let return_value = await model.delete_in_database(req);
	let all_data = await model.fetchall_in_database();

	if(typeof return_value=="object" && return_value.deletedCount>0){
		res.render('manager',{status:"Successfuly Delete",all_data:all_data});
	}else{
		res.render('manager',{status:return_value,all_data:all_data});
	}
	

})
app.post("/Employee", async (req, res) => {
	
	let return_value = await model.update_in_database(req);
	res.render('employee',{status:return_value});

})