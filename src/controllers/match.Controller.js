import { verifyToken } from "../helpers/handleJwt.js";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
export const matchPet =  async (req,res)=>{
       const {
        age,
        coat, 
        gender,
         genre,
         haTenidoMascota, 
         size , 
         type  
            }= req.body 
    try {
    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await verifyToken(token);
    const UserData= await User.findByPk(dataToken.id);
    if(UserData){
      const match=  await Match.create({
        age,
        coat, 
        gender,
        genre,
        haTenidoMascota, 
        size , 
        type,
        userId:UserData.id  
        })  
       console.log(match)
       res.json({
        message: "Match Created Successfully!",
      });
    }else{
        res.json("User not found")
    }
     
    } catch (error) {     
        res.json({error:error})
    }
}
export const PutMachUser = async (req,res) =>{
    const {id}=req.params;
    const {
        age,
        coat, 
        gender,
        genre,
        haTenidoMascota, 
        size, 
        type  
        }= req.body 
    try {
    await Match.update({
        age,
        coat, 
        gender,
        genre,
        haTenidoMascota, 
        size, 
        type  
    },
    {
    where:{
         userId:id
     }
    })
    return res.status(201).json({ message: "Match updated!" });
    } catch (error) {
        console.log(error)
    }
}