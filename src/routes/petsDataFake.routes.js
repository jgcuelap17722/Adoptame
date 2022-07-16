import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { typesPets } from '../database/typePets.js';
import { User } from '../models/User.js';
import pets from '../database/pets.js';

import axios from 'axios';

const router = Router();

router.get('/:results', async (req, res) => {
  let data = [];

  const createRandomUser = async () => {
    let names = {
      gato: {
        macho: [
          "Simón",
          "Oliver",
          "Milo",
          "Teo",
          "Tom",
          "Teo",
          "Pancho",
          "Felipe",
          "Gato",
          "Salem"
        ],
        hembra: [
          "Luna",
          "Lola",
          "Mia",
          "Olivia",
          "Misha",
          "Frida",
          "Lucy",
          "Nala",
          "Nina",
          "Simba"
        ]
      },
      perro: {
        macho: [
          "Milo",
          "Simon",
          "Teo",
          "Rocco",
          "Coco",
          "Totó",
          "Rocky",
          "Felipe",
          "Ciro",
          "Toby",
          "Pancho"
        ],
        hembra: [
          "Lola",
          "Luna",
          "Mora",
          "Olivia",
          "Nina",
          "Frida",
          "Uma",
          "Mía",
          "India",
          "Nala",
        ]
      }
    }

    let responseIds = await User.findAll({
      attributes: ['id'],
      raw: true
    });
    let ids = responseIds.map(user => user.id);
    let type = faker.helpers.arrayElement(['gato', 'perro']);

    let genders = faker.helpers.arrayElement(['macho', 'hembra']);


    let name = (type === 'gato' && genders === 'macho') ? faker.helpers.arrayElement(names.gato.macho) :
      (type === 'gato' && genders === 'hembra') ? faker.helpers.arrayElement(names.gato.hembra) :
        (type === 'perro' && genders === 'macho') ? faker.helpers.arrayElement(names.perro.macho) :
          (type === 'perro' && genders === 'hembra') ? faker.helpers.arrayElement(names.perro.hembra) : "Error"


    /*     let responseBreeds = await axios.get('https://api-rest-adoptame.herokuapp.com/api/v1.0/breed-pet');
        let breedsCats = responseBreeds.data.filter(gato => gato.typeId === 'gato');
        let nameBreedCats = breedsCats.map(nameBreedCat => nameBreedCat.name);
    
        let breedsDogs = responseBreeds.data.filter(gato => gato.typeId === 'perro');
        let nameBreedDogs = breedsDogs.map(nameBreedDog => nameBreedDog.name); */

    let nameBreedCats = typesPets[0].breeds.map(nameBreedCat => nameBreedCat);

    let nameBreedDogs = typesPets[1].breeds.map(nameBreedDog => nameBreedDog);

    let date = faker.date.recent(10, Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let published_at = year + '-' + month + '-' + dt;

    let resultPhotos = faker.datatype.number({ min: 1, max: 5 });
    let photosCats = [];
    for (let index = 0; index < resultPhotos; index++) {
      photosCats.push(faker.image.cats());
    }

    let photosDogs = [];
    for (let index = 0; index < resultPhotos; index++) {
      let { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      let urlImageDog = await data.message;
      photosDogs.push(urlImageDog);
    }

    return {
      userId: faker.helpers.arrayElement(ids),
      name: name,
      typeId: type,
      breedId: (type === 'perro') ? faker.datatype.number({ min: 1, max: 96 }) : faker.datatype.number({ min: 96, max: 163 }),
      colorId: (type === 'perro') ? faker.datatype.number({ min: 30, max: 44 }) : faker.datatype.number({ min: 1, max: 29 }),
      age: faker.helpers.arrayElement(pets.ages),
      gender: genders,
      size: faker.helpers.arrayElement(pets.sizes),
      coat: faker.helpers.arrayElement(pets.coats),
      health: faker.helpers.arrayElement(pets.healths),
      description: faker.lorem.paragraphs(),
      tags: faker.helpers.arrayElements(pets.tags, faker.datatype.number({ min: 1, max: 6 })),
      castrated: faker.helpers.arrayElement([true, false]),
      attributes: faker.helpers.arrayElement([{
        house_trained: faker.helpers.arrayElement([true, false, null]),
        special_needs: faker.helpers.arrayElement([true, false, null]),
        cats: faker.helpers.arrayElement([true, false, null]),
      }]),
      environment: faker.helpers.arrayElement([{
        children: faker.helpers.arrayElement([true, false, null]),
        dogs: faker.helpers.arrayElement([true, false, null]),
        cats: faker.helpers.arrayElement([true, false, null]),
      }]),
      status: faker.helpers.arrayElement(pets.status),
      photos: faker.helpers.arrayElements(type === 'gato' ? photosCats : photosDogs, resultPhotos),
      /*       breed: faker.helpers.arrayElement(type === 'gato' ? nameBreedCats : nameBreedDogs),
            specialCares: faker.helpers.arrayElement([true, false]),
            color: "in Db",
            published_at: published_at,
            photos: faker.helpers.arrayElements([type === 'gato' ? photosCats : photosDogs], resultPhotos),
            status: faker.helpers.arrayElement(['adoptable', 'adopted']),
            userId: faker.datatype.number({ min: 1, max: 10 }),
            city: faker.address.cityName(),
            address: faker.address.streetAddress() */
    };
  }

  const { results } = req.params;

  for (let i = 0; i < results; i++) {
    data.push(await createRandomUser());
  }

  return res.status(200).json(data);
});

export default router;
