'use strict'

const express= require ('express'); // me permite tener un objeto que permite obtener rutas.(crear rutas en el servidor).
const router=express.Router();

const Coment=require('../models/Coment'); // a partir de esta variable Coment puedo utilizar sus metodos, instanciarlos ya que esto fichero de Coment es un clase.
const {isAuthenticated} = require('../helpers/auth');

//New Coment
router.get('/coments/add', isAuthenticated, function(req,res){
    res.render('../views/coments/new_coment.hbs');
 });

// Save coments
router.post('/coments/new-coment',isAuthenticated, async function(req,res){
    const {coment} = req.body;
    const errors=[];
    if(!coment){
        errors.push({text:'Favor ingresar comentario. '});
    }
    if(errors.length > 0){
        res.render('../views/coments/new_coment.hbs', {
            errors, // pasamos los mensajes a la vista que estaos renderizando.
            coment // pasamos el mensaje en caso de que haya error.
        });
    }else{
        const newComent= new Coment({coment});
        
        newComent.user = req.user.id; 
        newComent.name = req.user.name;
        await newComent.save();// se guarda el comentario, se utiliza await ya que es un proceso asincrono.
        req.flash('success_msg','Comentario agregado!');
        res.redirect('/coments');
        
    }
});

//Get all coments
router.get('/coments', async  function(req,res){
    const coments =  await Coment.find().sort({date:'desc'});
    res.render('../views/coments/all_coments.hbs',{coments});
    console.log(coments);
});

//Comenst por usuario
router.get('/coments/my_coments', async  function(req,res){
    const coments =  await Coment.find({user: req.user.id}).sort({date:'desc'});
    res.render('../views/coments/mys_coments.hbs',{coments});
    console.log(coments);
    
});

//Edit coments
router.get('/coments/edit/:id', isAuthenticated , async function(req,res){ 
    const coment= await Coment.findById(req.params.id);
    res.render('../views/coments/edit_coment.hbs', {coment});
});

//Update coments
router.put('/coments/edit-coment/:id', isAuthenticated, async function(req,res){ // para poder manejar el metodo PUT, se hizo un campo hidden en la vista y una consulta para asignar PUT, REVISAR VISTA.
     const {coment}=req.body;
     await Coment.findByIdAndUpdate(req.params.id, {coment});//metodo que permite buscr por id.
     req.flash('success_msg', 'Comentario actualizado!.');
     res.redirect('/coments/my_coments');
});


// view coment to delete
router.get('/coments/delete/:id', isAuthenticated , async function(req,res){ 
    const coment= await Coment.findById(req.params.id);
    res.render('../views/coments/delete_coment.hbs', {coment});
});

//Delete coment
router.delete('/coments/delete/:id', isAuthenticated, async function(req,res){
      await Coment.findByIdAndDelete(req.params.id);
      req.flash('success_msg','Su comentario ha sido eliminado!.');
      res.redirect('/coments/my_coments');   
});

module.exports=router;