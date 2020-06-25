const express = require("express");
let router = express.Router();
const passport = require('passport')
const sneaker = require("./model/sneaker")
const plimit = require('p-limit');

const multer = require('multer');
const path =require("path")
const fs = require("fs")
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

  

let User = require("./model/db");
let app = express()




 cloudinary.config({ 
  cloud_name: 'supersheep', 
  api_key: '493192273215927', 
  api_secret: 'lnk8n_7Bpiin_KU50_oGxRmoOBg' 
});

var storage2 = new  CloudinaryStorage({ 
    cloudinary: cloudinary,
    params: {
      format: async (req, file) => 'png',
      public_id: (req, file) => file.originalname,
      path : (req, file) =>  `https://res.cloudinary.com/smilejob/image/upload/v159290293/${file.originalname}`,
    }
  })
  const upload2 = multer({ storage: storage2 });

let storage = multer.diskStorage({
  destination: "./public/uploadssneaker",
  filename:function(req,file,cb){
    cb(null,file.fieldname + "+" + Date.now() + "+" + path.extname(file.originalname));
  }
})
const imagefilter = function(req,file,cb){
  var ext = path.extname(file.originalname)
  if(ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".gif" )
  {
    return cb(new Error("only image"), false)
  }
  cb(null,true)
}
let upload = multer({storage : storage,fileFilter : imagefilter})





router.get('/admin', function(req, res) {
  sneaker.find({Sizesneaker:"7 US"},function(err,newsneaker){
    if(err){
      console.log("error")
    }else{

      res.render("admin",{newsneaker:newsneaker})
    }
  }).sort({$natural:-1}).limit(3)
});



router.get('/admin/sneaker/editlist', function(req, res) {
  sneaker.find({Brand:"nike"},function(err,findnike){
    if(err){
      console.log("error")
    }else{
      sneaker.find({Brand:"adidas"},function(err,findadidas){
        if(err){
          console.log("error")
        }else{
          sneaker.find({Brand:"jordan"},function(err,findjordan){
            if(err){
              console.log("error")
            }else{
              res.render('editlist2',{findnike:findnike,findadidas:findadidas,findjordan:findjordan});
            }
          })
        }
      })
    }
  })
})
     
    
 

 //ADD

router.get('/admin/sneaker/:id/detail', function(req, res) {
  sneaker.findById({_id:req.params.id},function(err,edit){
    if(err){
      console.log("error@@")
    }else{
      res.render('admindetails3',{edit:edit})
    }
  })
 
})

router.get('/admin/sneaker/add', function(req, res) {

  res.render('add');
});

router.post("/admin/sneaker/add",upload2.array('Image', 20),function(req , res ){
  let Image = req.files
  sneaker.create(new sneaker({Namesneaker :req.body.Namesneaker, Minidetail :req.body.Minidetail,Detail:req.body.Detail,Sizesneaker:req.body.Sizesneaker ,Price:req.body.Price, Image:Image , Brand :req.body.Brand , Color :req.body.Color,Count :req.body.Count,Date :req.body.Date
  })
  )
  req.flash('success','Add Sneaker Success');
  res.redirect("/admin")
})

router.get("/admin/user/edit",function(req , res){
     User.find({}).populate('sneakers').exec(function(error,eiei){
    if(error){
      console.log(error)
    }else{
      console.log(eiei)
          res.render("edituser",{eiei:eiei})
        }
      })
    }
  )

  router.get("/admin/user/edit/see/:id",function(req , res){
    User.findById({_id:req.params.id}).populate('sneakers').exec(function(error,hello){
   if(error){
     console.log(error)
   }else{
     console.log(hello)
         res.render("editusersee",{hello:hello})
       }
     })
   }
 )

  



//EDIT 

router.get('/admin/sneaker/:id/edit', function(req,res){
 sneaker.findById({_id:req.params.id},function(err, editsneaker){
      if(err){
          console.log("error!!");
      } else {
          res.render('editdetail', {editsneaker:editsneaker});
      }
  })
});


router.post('/admin/sneaker/:id/edit',upload2.array('Image',20),function(req,res){ 
  if(req.files){
    console.log(req.files)
    sneaker.findById({_id:req.params.id},function(err,find){
     
      })
      var Namesneaker = req.body.Namesneaker
      var Minidetail = req.body.Minidetail
      var Detail = req.body.Detail
      var Sizesneaker= req.body.Sizesneaker
      var Price= req.body.Price
      var Image= req.files
      var Brand= req.body.Brand
      var Color= req.body.Color
      var Count= req.body.Count
    }else{
      var Namesneaker = req.body.Namesneaker
      var Minidetail = req.body.Minidetail
      var Detail = req.body.Detail
      var Sizesneaker= req.body.Sizesneaker
      var Price= req.body.Price
      var Brand= req.body.Brand
      var Color= req.body.Color
      var Count= req.body.Count
    }
  // let Namesneaker = req.body.Namesneaker
  // let Minidetail = req.body.Minidetail
  // let Detail = req.body.Detail
  // let Sizesneaker= req.body.Sizesneaker
  // let Price= req.body.Price
  // let Image= req.body.Image
  // let Brand= req.body.Brand
  // let Color= req.body.Color
  // let Count= req.body.Count
  

  sneaker.updateMany({_id:req.params.id},{$set : {Namesneaker:Namesneaker,Minidetail:Minidetail,Detail:Detail,Sizesneaker:Sizesneaker,Price:Price,Image:Image,Brand:Brand,Color:Color,Count:Count}} ,function(err, update){
      if(err){
          console.log(err);
      } else {
           req.flash('success','Edit Sneaker Success');
          res.redirect('/admin/sneaker/editlist')
          }
      }
  );
    
  }
    )


//Remove 

    router.get('/admin/sneaker/:id/remove', function(req,res){ 
      sneaker.remove({_id:req.params.id},function(err,remove){
          if(err)
          console.log("error")
          else 
          {
              req.flash('success','You Remove Sneaker Successful');
              res.redirect("/admin")
              
          }
      })
       
    });

    
    router.get('/admin/user/:id/remove', function(req,res){ 
      User.remove({_id:req.params.id},function(err,remove){
          if(err)
          console.log(error)
          else 
          {
              req.flash('success','You Remove User Successful');
              res.redirect("/admin/user/edit")
              
          }
      })
       
    });
       






router.get("/nike",function(req,res){
  sneaker.find({ $and: [{Brand:"nike"},{Sizesneaker:"7 US"} ]},function(err,nike){
    if(err){
      console.log("error")
    }else{
     
      res.render("nike",{nike:nike})
    }
  }).sort({$natural:-1})
});


router.get("/adidas",function(req,res){
  sneaker.find({ $and: [{Brand:"adidas"},{Sizesneaker:"7 US"} ]},function(err,adidas){
    if(err){
      console.log("error")
    }else{
      res.render("adidas",{adidas:adidas})
    }
  }).sort({$natural:-1})
});

router.get("/jordan",function(req,res){
  sneaker.find({ $and: [{Brand:"jordan"},{Sizesneaker:"7 US"} ]},function(err,jordan){
    if(err){
      console.log("error")
    }else{
      res.render("jordan",{jordan:jordan})
    }
  }).sort({$natural:-1})
});


router.get('/searchAdmin', function(req,res){
  sneaker.findOne({Namesneaker: {$regex: req.query.findsneakers }},function(err,sneakershow){
        if(sneakershow == null){
          req.flash('error','CAN NOT FIND SNEAKER');
         res.redirect("/admin")
        }
       else {
         console.log(sneakershow)
      res.redirect("/admin" + "/sneaker" + "/" + sneakershow._id  + "/detail")
      }
  })
});




module.exports = router;