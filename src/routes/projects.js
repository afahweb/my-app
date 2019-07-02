'use strict'

const express = require('express');
const router = express.Router();
const path=require('path');
const morgan = require('morgan');
const multer = require('multer'); // libreria de express para subir imagenes.
const uuid = require('uuid');
const { unlink } = require('fs-extra');


const Project = require('../models/Project');
const {isAuthenticated} = require('../helpers/auth');




//configuración de multer para que agregue el nombre original a la imagen, como los va a guardar.
// le estamos pasando donde se va guardar las imagenes y con que configuración.
const storageimage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename : function(req,file,cb){
         cb(null, uuid() + path.extname(file.originalname)); // con uuid guradamos la imagen on un id.
    }
  });

//Middleeare multer configuración de multer para subir imagenes con el nombre orginal y establcer peso en kb.
router.use(multer({
    storage: storageimage,
    dest: path.join(__dirname, 'public/uploads'),// para crear la carpeta dentro de src, lo concatenamos con el metodo path.
    limits:{fileSize:2000000}, //imagen de 2 megas.
    fileFilter:function(req,file,cb){
        const filestypes = /jpeg|jpg|png/;
        const mimetype = filestypes.test(file.mimetype);
        const extname = filestypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true)
        }else{
            errors.push({text:'La imagen debe tener un formato válido.'});
        }

    }
  }).single('image')); // nombre del input de la vista que sube la imagen.
  

//New project
router.get('/projects/add', isAuthenticated, async function(req,res){
    res.render('../views/projects/new_project.hbs');
});

router.post('/projects/new-project', isAuthenticated, async function(req, res){
  const {name,description,category,year,langs} = req.body;
  const errors=[];
  if(!name){
      errors.push({text:'Se require nombre del proyecto'});
  }
  if(!description){
      errors.push({text:'Se require descripción del proyecto'});  
  }
  if(category =='Seleccionar'){
      errors.push({text:'Por favor seleccionar una categoría válida'});
  }
  if(year == 'Seleccionar'){
      errors.push({text: 'Por favor seleccionar el año de creación'});
  }
  if(!langs){
      errors.push({text: 'Se require alguna tecnología utilizada'});
  }
  if(errors.length > 0){
      res.render('../views/projects/new_project.hbs', {
          errors,
          name,
          description,
          category,
          year,
          langs
      });
} else{
    
    const newProject= new Project({name,description,category,year,langs});
    newProject.filename = req.file.filename;
    newProject.path = 'uploads/'+ req.file.filename;
    newProject.user= req.user.id; // con esta linea de código guardamos los proyectos por usuario.
    newProject.name_user = req.user.name;
    await newProject.save();
    console.log(req.file);
    req.flash('success_msg','Proyecto guardado con éxito!.');
    res.redirect('/projects'); 
    
    //otra forma de guardar los proyectos.
    /* const newProject = new Project();
    newProject.name = req.body.name;
    newProject.description = req.body.description;
    newProject.category = req.body.category;
    newProject.year = req.body.year;
    newProject.langs = req.body.year;
    newProject.image = req.file.filename;
    newProject.user = req.user.id; 
    
    await newProject.save();
    res.redirect('projects'); */

}
});

//Get all projects
router.get('/project', isAuthenticated, async function(req,res){
    const projects = await Project.find({user:req.user.id}).sort({date:'desc'});
    console.log(projects);
    res.render('../views/projects/all_projects.hbs', {projects});
});

//Get all_users_projects
router.get('/projects',isAuthenticated, async function(req,res){
   const projects = await Project.find({}).sort({date:'desc'});
   console.log(projects);
   res.render('../views/projects/all_user_projects.hbs',{projects});
});


//Edit projects
router.get('/projects/edit/:id', isAuthenticated , async function(req,res){ 
    const project = await Project.findById(req.params.id);
    res.render('../views/projects/edit_project.hbs', {project});
});

//Update projects
router.put('/projects/edit-project/:id', isAuthenticated, async function(req,res){ // para poder manejar el metodo PUT, se hizo un campo hidden en la vista y una consulta para asignar PUT, REVISAR VISTA.
    const {name,description,category,year,langs} = req.body;
    const filename = req.file.filename;
    const path = 'uploads/'+ req.file.filename;
    await Project.findByIdAndUpdate(req.params.id,{name,description,category,year,langs,filename,path});//metodo que permite buscr por id.
    req.flash('success_msg', 'Proyecto actualizado!.');
    res.redirect('/project');
});


// view project to delete
router.get('/projects/delete/:id', isAuthenticated , async function(req,res){ 
    const project = await Project.findById(req.params.id);
    res.render('../views/projects/delete_project.hbs', {project});
});

//delete projects
router.delete('/projects/delete/:id', isAuthenticated, async function(req,res){
    const project = await Project.findByIdAndDelete(req.params.id);
    await unlink(path.resolve('./src/public/' + project.path));
    req.flash('success_msg','El proyecto ha sido eliminado!.');
    res.redirect('/project');   
});

module.exports = router;  





