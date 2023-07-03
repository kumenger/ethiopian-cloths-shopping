const router = require('express').Router();

const Cloth=require('../models/Cloth')
router.post('/addCloth',async(req,res)=>{
try {
    let {clothname}=req.body
    const cloth=await Cloth.findOne({clothname:clothname})
    if(cloth){
        res.status(404).json({msg: "This CLoth is aready Saved"})
    }
    let newCloth = await Cloth.create(req.body);
    res.json({msg:`${newCloth.clothname} is save to cloth collection`})
} catch (error) {
    res.status(500).json({msg : error})
}
})
module.exports = router