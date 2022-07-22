import { verifyToken } from "../helpers/handleJwt.js";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
export const matchPet =  async (req,res)=>{
       const {
        age,
        coat,
        genre,
        haTenidoMascota,
        size,
        type
            }= req.body 
    try {
    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await verifyToken(token);
    const UserData= await User.findByPk(dataToken.id);
    if(UserData){
           const verifMatch= await Match.findOne({where:{userId:UserData.id}})
           if(verifMatch){
            res.status(404).json({
                message: "Ya tienes un match",
              });
           }else{
       await Match.create({
        age,
        coat,
        genre,
        haTenidoMascota,
        size,
        type,
        userId:UserData.id  
        })  
       return res.json({
            message: "Match Created Successfully!",
          });
        }
    }else{
        res.json({error:"Porfavor vuelve a loguearte"})
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
        genre,
        haTenidoMascota,
        size,
        type, 
        }= req.body 
    try {
    await Match.update({
        age,
        coat,
        genre,
        haTenidoMascota,
        size,
        type, 
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
//DELETE DE MATCH PARA PRUEBA EN EL FRONT 
export const DeleteMatch = async (req,res)=>{
const {id}= req.params
  try {
    if(id){
        const match= await Match.findOne({where:{id:id}})
        if(!match){
            res.json({message:"no se encotro el id de este match en la base de datos"})
      
    }else{
        await Match.destroy({where:{
            id:id
          }})
          res.json({message:"Match eliminado"})
            }
    }
  } catch (error) {
    res.json({message:error})
  }

}
