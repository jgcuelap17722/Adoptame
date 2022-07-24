import { Pets } from '../../models/Pets.js';
import { User } from '../../models/User.js';
import { TypePet } from '../../models/Typepet.js';
import { BreedPet } from '../../models/Breedpet.js';
import { City } from '../../models/City.js';
import { Country } from '../../models/Country.js';
import { ColorPet } from '../../models/Colorpet.js';

const removePropertiesFrom = (object) => {
  delete object["user.id"];
  delete object["user.name"];
  delete object["user.email"];
  delete object["user.phone"];
  delete object["user.lastName"];
  delete object["user.password"];
  delete object["user.address"];
  delete object["user.photo"];
  delete object["user.starts"];

  delete object["user.cityId"];
  delete object["user.city.name"];
  delete object["user.city.id"];
  delete object["user.city.countryId"];

  delete object["user.country.id"];
  delete object["user.country.name"];
  delete object["user.country.currency"];
  delete object["user.country.symbol"];

  delete object["user.countryId"];
  delete object["user.role"];
  delete object["user.active"];
  delete object["user.verification"];
  delete object["user.donaciones"];
  delete object["user.document"];

  delete object["colorpet.nameColor"];
  delete object["typepet.nameType"];
  delete object["breedpet.nameBreed"];
  delete object["colorId"];
}

export const findByUser = async (userId) => {
  const pets = await Pets.findAll({
    attributes: { exclude: ['breedId', 'typeId'] },
    include: [
      {
        model: ColorPet,
        attributes: ['nameColor'],
      },
      {
        model: TypePet,
        attributes: ['nameType'],
      },
      {
        model: BreedPet,
        attributes: ['nameBreed'],
      },
      {
        model: User,
        // attributes: ['address'],
        include: [
          {
            model: Country,
          },
          {
            model: City,
            // attributes: ['name'],
          }
        ]
      }
    ],
    where: {
      userId: userId,
    },
    raw: true,
  });

  const responsePets = pets.map((pet) => {

    // renombrar Propiedades
    pet['type'] = pet["typepet.nameType"];
    pet['breed'] = pet["breedpet.nameBreed"];
    pet['color'] = pet["colorpet.nameColor"];
    pet['role'] = pet["user.role"];

    // formatear valores de propiedades
    pet.status_changed_at = Number(new Date(pet["published_at"])); // EPOCH format
    pet.environment = JSON.parse(pet.environment)
    pet.attributes = JSON.parse(pet.attributes)
    pet.photos = pet.photos.map((photo) => {
      return {
        option_1: photo,
        option_2: photo,
        option_3: photo,
      }
    })

    // nuevas propiedades
    pet.contact = {
      email: pet["user.email"],
      phone: pet["user.phone"],
      address: {
        address: pet["user.address"],
        city: pet["user.city.name"],
        state: pet["user.state.name"] || null,
        postcode: pet["user.city.postcode"] || null,
        country: pet["user.countryId"]
      }
    }
    // remover propiedades innesesarias
    removePropertiesFrom(pet)
    return pet
  });
  return responsePets;
}

export const findAllPets = async () => {
  const pets = await Pets.findAll({
    attributes: { exclude: ['breedId', 'typeId'] },
    include: [
      {
        model: ColorPet,
        attributes: ['nameColor'],
      },
      {
        model: TypePet,
        attributes: ['nameType'],
      },
      {
        model: BreedPet,
        attributes: ['nameBreed'],
      },
      {
        model: User,
        // attributes: ['address'],
        include: [
          {
            model: Country,
          },
          {
            model: City,
            // attributes: ['name'],
          }
        ]
      }
    ],
    raw: true,
  });

  const responsePets = pets.map((pet) => {

    // renombrar Propiedades
    pet['type'] = pet["typepet.nameType"];
    pet['breed'] = pet["breedpet.nameBreed"];
    pet['color'] = pet["colorpet.nameColor"];
    pet['role'] = pet["user.role"];

    // formatear valores de propiedades
    pet.status_changed_at = Number(new Date(pet["published_at"])); // EPOCH format
    pet.environment = JSON.parse(pet.environment)
    pet.attributes = JSON.parse(pet.attributes)
    pet.photos = pet.photos.map((photo) => {
      return {
        option_1: photo,
        option_2: photo,
        option_3: photo,
      }
    })

    // nuevas propiedades
    pet.contact = {
      email: pet["user.email"],
      phone: pet["user.phone"],
      address: {
        address: pet["user.address"],
        city: pet["user.city.name"],
        state: pet["user.state.name"] || null,
        postcode: pet["user.city.postcode"] || null,
        country: pet["user.countryId"]
      }
    }
    // remover propiedades innesesarias
    removePropertiesFrom(pet)
    return pet
  });
  return responsePets;
}

export const findByPkPets = async (id) => {
  const pet = await Pets.findByPk(id, {
    attributes: { exclude: ['breedId', 'typeId'] },
    include: [
      {
        model: ColorPet,
        attributes: ['nameColor'],
      },
      {
        model: TypePet,
        attributes: ['nameType'],
      },
      {
        model: BreedPet,
        attributes: ['nameBreed'],
      },
      {
        model: User,
        include: [
          {
            model: Country,
          },
          {
            model: City,
          }
        ]
      }
    ],
    raw: true,
  });
    // renombrar Propiedades
    pet['type'] = pet["typepet.nameType"];
    pet['breed'] = pet["breedpet.nameBreed"];
    pet['color'] = pet["colorpet.nameColor"];
    pet['role'] = pet["user.role"];

    // formatear valores de propiedades
    pet.status_changed_at = Number(new Date(pet["published_at"])); // EPOCH format
    pet.environment = JSON.parse(pet.environment)
    pet.attributes = JSON.parse(pet.attributes)
    pet.photos = pet.photos.map((photo) => {
      return {
        option_1: photo,
        option_2: photo,
        option_3: photo,
      }
    })

    // nuevas propiedades
    pet.contact = {
      email: pet["user.email"],
      phone: pet["user.phone"],
      address: {
        address: pet["user.address"],
        city: pet["user.city.name"],
        state: pet["user.state.name"] || null,
        postcode: pet["user.city.postcode"] || null,
        country: pet["user.countryId"]
      }
    }
    // remover propiedades innesesarias
    removePropertiesFrom(pet)
    return pet
}

export const findByFoundation = async () => {
  const pets = await Pets.findAll({
    attributes: { exclude: ['breedId', 'typeId'] },
    include: [
      {
        model: ColorPet,
        attributes: ['nameColor'],
      },
      {
        model: TypePet,
        attributes: ['nameType'],
      },
      {
        model: BreedPet,
        attributes: ['nameBreed'],
      },
      {
        model: User,
        // attributes: ['address'],
        include: [
          {
            model: Country,
          },
          {
            model: City,
            // attributes: ['name'],
          }
        ],
        where: {
          role: "fundation"
        }
      }
    ],
    raw: true,
  });

  const responsePets = pets.map((pet) => {

    // renombrar Propiedades
    pet['type'] = pet["typepet.nameType"];
    pet['breed'] = pet["breedpet.nameBreed"];
    pet['color'] = pet["colorpet.nameColor"];
    pet['role'] = pet["user.role"];

    // formatear valores de propiedades
    pet.status_changed_at = Number(new Date(pet["published_at"])); // EPOCH format
    pet.environment = JSON.parse(pet.environment)
    pet.attributes = JSON.parse(pet.attributes)
    pet.photos = pet.photos.map((photo) => {
      return {
        option_1: photo,
        option_2: photo,
        option_3: photo,
      }
    })

    // nuevas propiedades
    pet.contact = {
      name: pet["user.name"],
      email: pet["user.email"],
      phone: pet["user.phone"],
      address: {
        address: pet["user.address"],
        city: pet["user.city.name"],
        state: pet["user.state.name"] || null,
        postcode: pet["user.city.postcode"] || null,
        country: pet["user.countryId"]
      }
    }
    // remover propiedades innesesarias
    removePropertiesFrom(pet)
    return pet
  });
  return responsePets;
}