import { asyncHandeler } from "../utils/asynchandeler.js";


const registerUser = asyncHandeler(async (req,res)=>{
    res.status(200).json({
        message:"hello atharva"
    })
})



export  {registerUser};