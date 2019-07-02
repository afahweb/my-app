'use strict'

const express = require('express');
const router=express.Router();

const Sheet = require('../models/Sheet');
const {isAuthenticated} = require('../helpers/auth');

//New Sheet
router.get('/sheets/add', isAuthenticated, async function(req,res){
     res.render('../views/sheets/new_sheet.hbs');
});

router.post('/sheets/new-sheet', isAuthenticated, async function(req,res){
     const {name,data,profile,studies,experience,reference} = req.body;
     const errors = []
     if(!name){
         errors.push({text:'Por favor ingrese su nombre completo.'});
     }
     if(!data){
         errors.push({text:'Por favor ingrese sus datos personales.'});
    }
    if(!profile){
        errors.push({text:'Por favor ingrese su perfil profesional'});
    }
    if(!studies){
        errors.push({text:'Por favor ingrese sus estudios'});
    }
    if(!experience){
        errors.push({text:'por favor ingrese su expericia laboral'});
    }
    if(!reference){
        errors.push({text:'Por favor ingrese referecias personales'});
    }
    if(errors.length > 0){
        res.render('../views/sheets/new_sheet.hbs', {
            errors,
            name,
            data,
            profile,
            studies,
            experience,
            reference
        });
    }else{
        const newSheet = new Sheet({name,data,profile,studies,experience,reference});
        newSheet.user = req.user.id; // guardamos la hoja de vida relacionada a cada usuario.
        await newSheet.save();
        req.flash('success_msg','Hoja de vida almacenda correctamente.');
        res.redirect('/sheets');
    }
});

//Get all sheets
router.get('/sheets', isAuthenticated, async function(req, res){
    const sheets = await Sheet.find({user:req.user.id}).sort({date:'desc'});
    res.render('../views/sheets/all_sheets.hbs', {sheets});
});

//Get all_users_sheets
router.get('/sheets/all-users', isAuthenticated, async function(req,res){
   const sheets = await Sheet.find().sort({date:'desc'});
   res.render('../views/sheets/all_user_sheets.hbs', {sheets});
});


// Edit sheets
router.get('/sheets/edit/:id', isAuthenticated, async function(req,res){
    const sheet = await Sheet.findById(req.params.id);
    res.render('../views/sheets/edit_sheet.hbs', {sheet});
})

//Update sheets
router.put('/sheets/edit-sheet/:id', isAuthenticated, async function(req,res){ // para poder manejar el metodo PUT, se hizo un campo hidden en la vista y una consulta para asignar PUT, REVISAR VISTA.
    const {name,data,profile,studies,experience,reference} = req.body;
    await Sheet.findByIdAndUpdate(req.params.id, {name,data,profile,studies,experience,reference}); //metodo que permite buscar por id.
    req.flash('success_msg', 'Registro actualizado exitosamente!.');
    res.redirect('/sheets');
});

//Delete Sheet
router.delete('/sheets/delete/:id', isAuthenticated, async function(req,res){
   await Sheet.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Curriculum eliminado!.');
   res.redirect('/sheets');
});

module.exports = router;