const {Departments} = require('../model/departments');
const express = require('express');


const router = express.Router();

router.get('/',async (req,res) =>{
    res.send("testing department populate");
})
router.post('/add',async (req,res)=> {
    try{
        const newDepartment = new Departments ({
        department_name : "department2"
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
    }catch(error){
        consoler.error(error);
        res.status(500).json({error: "Failed or something"});
    }
})
module.exports = router;