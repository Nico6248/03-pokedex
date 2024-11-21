import { Injectable } from '@nestjs/common';
import { PokeResponce } from './Interfaces/poke-responce.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    
    private readonly http: AxiosAdapter,
  ){}
  

  
  async executeSeed(){
    await this.pokemonModel.deleteMany({});//delete * from pokemos;
    const data = await this.http.get<PokeResponce>('https://pokeapi.co/api/v2/pokemon?limit=650')
    
    //primera manera de insertar por lotes
    // const insertPromisesArray = [];
    // data.results.forEach( ({name, url})=>{
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   // const pokemon = await this.pokemonModel.create({name, no});
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   );
    // });
    // await Promise.all( insertPromisesArray)

    const pokemonToInsert: {name: string, no: number}[] = [];


    data.results.forEach( ({name, url})=>{
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // const pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({name, no});
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }
}
