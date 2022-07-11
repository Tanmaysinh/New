const mongoose = require("mongoose");

mongoose
    .connect('mongodb+srv://tanmay_khant:khant5108@cluster0.bxdlp.mongodb.net/Tntra?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log("connectted");
    })
    .catch((err) => console.log(err));

const employee_detail = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    contactno:Number,
    position:String,
    password:String,

})
const details = mongoose.model("employee_detail",employee_detail);


const fetch_in_database = async function(req){
   return await details.findOne({email:req.body.email});
}

const fetchall_in_database = async function(){   
   return await details.find({position:"Employee"});    
}


const save_in_database = async function(req) {
	
    let new_employe=new details({
        email:req.body.email,
        name:req.body.name,
        contactno:req.body.contactno,
        position:req.body.position,
        password:req.body.password,

    });
   

    try{
        let value= await new_employe.save();
        return value;
    }catch{
        return "error";
    }


// =====problem======="return value is always 0.await function is not working first it
//               return x with value 0 and then written if else statment was execute"==================



    // let new_employe=new details({
    //         email:req.body.email,
    //         name:req.body.name,
    //         contactno:req.body.contactno,
    //         position:req.body.position,
    //         password:req.body.password,

    // });
    // var x=0;
    // let value= await new_employe.save((e,x)=>{
    //     if(e){
    //         console.log("|||||||",e);

    //         x=1;
    //         return "error";
    //     }else{
    //         x=2;
    //         return "success";
    //     }
    // })
    // console.log(value,x)
    // return x;
// =============================problem code end========================

}


const delete_in_database = async function(req){
    try{

        return await details.deleteOne({_id:req.body.id});
       

    }catch{
         return "Something went wrong";
    }
       
       

}
const update_in_database = async function(req){    
    try{

        return await details.updateOne({_id:req.body._id},{$set:{
        name:req.body.name,
        email:req.body.email,
        contactno:req.body.contactno,
        password:req.body.password,
        }});

    }catch{
         return "Something went wrong";
    }
        
    
       

}


module.exports = { save_in_database , delete_in_database,update_in_database ,fetch_in_database,fetchall_in_database};