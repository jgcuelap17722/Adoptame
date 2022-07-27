import { encrypt, compare } from "../helpers/handleBcrypt.js";
import { City } from "../models/City.js";
import { Country } from "../models/Country.js";
import { User } from "../models/User.js";
import { findAllUsers, findUserById } from "../models/Views/users.views.js";
// import { deleteFile } from "../middlewares/cloudinary.js";
import { Solicitudes } from "../models/Solicitudes.js";
import { findByUser } from "../models/Views/pets.views.js";
import { findCity } from "./petsController.js";

/// POST USER
export const createUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // const documentfile = req.files.map((d) => d.path);
  // const idfiles = req.files.map((d) =>
  //   d.filename.slice(d.filename.lastIndexOf("/") + 1)
  // );
  // {
  //   "role": "user",
  //   "name": "Emilio",
  //   "lastName": "Andrés",
  //   "countryId": "CHL",
  //   "cityId": "Santiago",
  //   "email": "emiliorealg@gmail.com",
  //   "auth0": true,
  //   "countryName": "Chile",
  //   "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImYzak94OHNGTjNPR0FtNDdpZkhEOCJ9.eyJodHRwczovL2V4YW1wbGUuY29tL2VtYWlsIjoiZW1pbGlvcmVhbGdAZ21haWwuY29tIiwiaXNzIjoiaHR0cHM6Ly9kZXYtcy1rbWhreXoudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA5MzY3MjM3MTQzMTUyMzAzNjIyIiwiYXVkIjpbImh0dHBzOi8vZGV2LXMta21oa3l6LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtcy1rbWhreXoudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1ODgxMjc4OSwiZXhwIjoxNjU4ODk5MTg5LCJhenAiOiJ2NnJqd1EwM1FBNHhiZUFiV2M0dEc5YVJEaDRzTkg1USIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSJ9.FwN41ByPzPjcnuGYgvUyWr-kPIMJBhKKiIh0CyGbspA1sOhjfJ8Rg_PbkJ0MSFQxDtEGpFa6JmjJ8S-ABHmKZnJS40_fp53e1o9ducUtbm9qz9TJJuA0p-Ejs7W7kTUt6thbaaEoYqOF1PM3IEI_oKKii034Jn0HW863xl9_X1wo8_18BwdkRyMfhNKSIqm_SnDE4a2RtuFO4N50ZshxFX2BxoZ_TwWtsyF8gCGTGM-8eQfTu5SPrtbPp4i14wiv0BqkPrQPirHemQqptJCfuW6jigmekTOAMErUDAvMUXD9I7uOkKHY09nJBezC7Uf3F6jiopI9psXw0BuR6ANTmA",
  //   "userId": "google-oauth2|109367237143152303622",
  //   "password": 1658813902294
  // }

  const {
    name,
    lastName,
    password,
    email,
    active,
    verification,
    donaciones,
    countryId,
    cityId,
    address,
    phone,
    role,
    document,
    auth0,
    photo,
  } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user === null) {
      if (auth0) {
        const cityName = await findCity(cityId);
        const country = await Country.findByPk(countryId);
        const city = await City.findByPk(cityName[0].id);
        const passwordHash = await encrypt(password);
        const userCreated = await User.create({
          email,
          name,
          lastName,
          password: passwordHash,
          role,
        });
        //password set in undefined for security
         userCreated.set("password", undefined, { strict: false });
         userCreated.setCountry(country);
         userCreated.setCity(city);
        return res.json({Ok: "User created successfully"});
      }
      const country = await Country.findByPk(countryId);
      const city = await City.findByPk(cityId);
      if (country && city) {
        //Hash of password.
        const passwordHash = await encrypt(password);
        switch (role) {
          case "fundation":
            const userFundation = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              role,
              active: false,
              document: document,
            });
            //password set in undefined for security
            userFundation.set("password", undefined, { strict: false });
            userFundation.setCountry(country);
            userFundation.setCity(city);
            Solicitudes.create({
              userId: userFundation.id,
              solicitud: "Verificacion de documento",
            });
            return res.json({
              message:
                "User Created Successfully!, If you solicited a verification of fundation the state is pending",
            });

          case "admin":
            const userAdmin = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              role,
            });
            //password set in undefined for security
            userAdmin.set("password", undefined, { strict: false });
            userAdmin.setCountry(country);
            userAdmin.setCity(city);
            return res.json({
              message: "Admin Created Successfully!",
            });
          default:
            const user = await User.create({
              name,
              lastName,
              password: passwordHash,
              email,
              active,
            });
            //password set in undefined for security
            user.set("password", undefined, { strict: false });
            user.setCountry(country);
            user.setCity(city);
            return res.json({
              message: "User Created Successfully!",
            });
        }
      }
      return res.status(404).json({ error: "City and Country is required " });
    } else {
      // deleteFile(idfiles);
      return res.status(400).send(user);
    }
    // const data = {
    //   token: await tokenSing(userFundationCountry),
    //   user: userFundationCountry,
    // };
    // return res.send(data);
  } catch (error) {
    // deleteFile[idfiles];
    return res.status(500).json({ error: error.message });
  }
};

/// GET USER
export const getUser = async (req, res) => {
  // #swagger.tags = ['USER']
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  try {
    const users = await findAllUsers();
    return res.send(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/// GET DETAILS USER
export const getDetailUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  try {
    const dataUser = await findUserById(id);
    return res.send(dataUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { password, newPassword, cityId, countryId } = req.body;
  const us = await User.findOne({
    where: {
      id,
    },
  });

  try {
    if (password && newPassword) {
      const checkPassword = await compare(password, us.password);
      if (checkPassword) {
        //Hash of password.
        const passwordHash = await encrypt(newPassword);
        await User.update(
          {
            password: passwordHash,
          },
          {
            where: {
              id,
            },
          }
        );

        return res.send({ Ok: "Password Updated Successfully!!" });
      } else {
        return res.status(401).json({
          error: "Password Incorrect, Please insert your actual password",
        });
      }
    }

    await User.update(req.body, {
      where: {
        id,
      },
    });

    const user = await findUserById(id);
    const dataUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      country: user.country,
      city: user.city,
      address: user.address,
      phone: user.phone,
      active: user.active,
    };

    return res.send(dataUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//PUT USER from admin
export const adminUpdateUser = async (req, res) => {
  // #swagger.tags = ['USER']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { name, lastName, role, address, phone, active } = req.body;
  console.log(req.body);
  try {
    await User.update(
      {
        name,
        lastName,
        role,
        address,
        phone,
        active,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(201).json({ message: "Updated!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//PUT solicitud from admin

export const updatesolicitud = async (req, res) => {
  // #swagger.tags = ['SOLICITUD']
  // #swagger.security = [{"apiKeyAuth": []}]
  const { id } = req.params;
  const { estado, fechafinaliza } = req.body;
  try {
    if (id) {
      await Solicitudes.update(
        {
          estado,
          fechafinaliza,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(201).json({ message: "State Updated!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
