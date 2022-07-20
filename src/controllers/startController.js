import { User } from "../models/User.js";

export const prop = async (req, res) => {

    const { id } = req.params
    const {punt} = req.body

    const user = await User.findOne({
        where: {
          id,
        },
      });
      try {
        await User.update(
            {
              starts: [...user.starts, punt]
            },
            {
              where: {
                id,
              },
            }
          );


          return res.status(201).json({ msg: "puntuacion exitosa" });        
      } catch (error) {
        console.log(error)
        res.status(400).json({msg: "error de puntuacion"})
      }
}


export const starts = async (req, res) => {

    const { id } = req.params;
    const user = await User.findOne({
        where: {
          id,
        },
      });
    try {
        let point = user.starts;
        if (!point.length) {return res.status(400).json({msg: "el usuario no ha sido calificado"})}
        let all = 0;
        for (let i = 0; i < point.length; i++) {
            all += point[i]
        }
        let prom = all / point.length;

        if (!Number.isInteger(prom)) {return res.status(201).json({ msg: `la puntuacion es: ${prom.toFixed(1)}` })}

        return res.status(200).json({ msg: `la puntuacion es: ${prom}`});
    } catch (error) {
        console.log(error)
        res.status(400).json({msg: "error de promedio"})
    }
}