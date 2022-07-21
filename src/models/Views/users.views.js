import { User } from "../User.js";
import { Solicitudes } from "../Solicitudes.js";
import { Country } from "../Country.js";
import { City } from "../City.js";
import { Pets } from "../Pets.js";

export const findUserById = async (id) => {
  const user = await User.findByPk(
    id,
    { include: Pets },
    { include: Solicitudes }
  );
  if (user) {
    const pets = await Pets.findAll({ where: { userId: id } });
    const city = await City.findByPk(user.cityId);
    const country = await Country.findByPk(user.countryId);
    const soli = await Solicitudes.findAll({ where: { userId: id } });
    const dataUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      donaciones: user.donaciones,
      country: country.name,
      city: city.name,
      address: user.address,
      phone: user.phone,
      active: user.active,
      verification: user.verification,
      document: user.document,
      pets: pets.map((e) => e),
      solicitudes: soli.map((e) => e),
    };

    return dataUser;
  } else {
    return { error: "User Not Found" };
  }
};

export const findAllUsers = async () => {
  const users = await User.findAll();
  const getCountry = async (id) => {
    const country = await Country.findByPk(id);
    return country.name;
  };

  const getCity = async (id) => {
    const city = await City.findByPk(id);
    return city.name;
  };
  const dataUsers = await Promise.all(
    users.map(async (user) => {
      return {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        donaciones: user.donaciones,
        country: await getCountry(user.countryId),
        city: await getCity(user.cityId),
        address: user.address,
        phone: user.phone,
        active: user.active,
        verification: user.verification,
      };
    })
  );
  return dataUsers;
};
