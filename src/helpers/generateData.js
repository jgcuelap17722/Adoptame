import { faker } from '@faker-js/faker';
import pets from '../database/pets.js';

import axios from 'axios';

export const generateDataPets = async (results, ids) => {

  let data = [];

  const petsGenerated = async () => {
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
    let type = faker.helpers.arrayElement(['gato', 'perro']);
    let genders = faker.helpers.arrayElement(['macho', 'hembra']);
    let name = (type === 'gato' && genders === 'macho') ? faker.helpers.arrayElement(names.gato.macho) :
      (type === 'gato' && genders === 'hembra') ? faker.helpers.arrayElement(names.gato.hembra) :
        (type === 'perro' && genders === 'macho') ? faker.helpers.arrayElement(names.perro.macho) :
          (type === 'perro' && genders === 'hembra') ? faker.helpers.arrayElement(names.perro.hembra) : "Error"

    let resultPhotos = faker.datatype.number({ min: 2, max: 5 });

    let urlCats = new Set();
    for (let index = 0; index < resultPhotos; index++) {
      let urlImageCat = faker.image.cats(640, 480, true)
      if (!urlCats.has(urlImageCat)) {
        urlCats.add(urlImageCat);
        continue;
      }
      index = index - 1
    }
    let photosCats = Array.from(urlCats);

    let urlDogs = new Set();
    for (let index = 0; index < resultPhotos; index++) {
      let { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      let urlImageDog = data.message;
      if (!urlDogs.has(urlImageDog)) {
        urlDogs.add(urlImageDog);
        continue;
      }
      index = index - 1
    }
    let photosDogs = Array.from(urlDogs);

    return {
      userId: faker.helpers.arrayElement(ids),
      name: name,
      typeId: type,
      breedId: (type === 'perro') ? faker.datatype.number({ min: 1, max: 96 }) : faker.datatype.number({ min: 96, max: 163 }),
      colorId: (type === 'perro') ? faker.datatype.number({ min: 30, max: 44 }) : faker.datatype.number({ min: 1, max: 29 }),
      age: faker.helpers.arrayElement(pets[0].ages),
      gender: genders,
      size: faker.helpers.arrayElement(pets[0].sizes),
      coat: faker.helpers.arrayElement(pets[0].coats),
      health: faker.helpers.arrayElement(pets[0].healths),
      description: faker.lorem.paragraphs(),
      tags: faker.helpers.arrayElements(pets[0].tags, faker.datatype.number({ min: 1, max: 6 })),
      castrated: faker.helpers.arrayElement([true, false]),
      attributes: JSON.stringify(faker.helpers.arrayElement([{
        house_trained: faker.helpers.arrayElement([true, false, null]),
        special_needs: faker.helpers.arrayElement([true, false, null]),
      }])),
      environment: JSON.stringify(faker.helpers.arrayElement([{
        children: faker.helpers.arrayElement([true, false, null]),
        dogs: faker.helpers.arrayElement([true, false, null]),
        cats: faker.helpers.arrayElement([true, false, null]),
      }])),
      status: faker.helpers.arrayElement(pets[0].status),
      photos: faker.helpers.arrayElements(type === 'gato' ? photosCats : photosDogs, resultPhotos),
    };
  }

  for (let i = 0; i < results; i++) {
    data.push(await petsGenerated());
  }
  return data;
};

