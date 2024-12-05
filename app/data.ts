import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import invariant from "tiny-invariant";

// Tipo de estructura para un personaje de Rick and Morty
type CharacterMutation = {
  id?: string;
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  image?: string;
  favorite?: boolean;
};

export type CharacterRecord = CharacterMutation & {
  id: string;
  createdAt: string;
};

  
////////////////////////////////////////////////////////////////////////////////
// Aquí hacemos las funciones para interactuar con la API de Rick and Morty
const apiUrl = "https://rickandmortyapi.com/api/character";

async function getAllCharacters(query?: string | null): Promise<CharacterRecord[]> {
  const url = query ? `${apiUrl}?name=${query}` : apiUrl;
  const res = await fetch(url);
  const data = await res.json();
  return (data.results || []).map((character: any) => ({
    id: character.id.toString(),
    name: character.name,
    status: character.status,
    species: character.species,
    gender: character.gender,
    image: character.image,
    createdAt: new Date().toISOString(),
    
    
  }))
}

async function getCharacter(id: string): Promise<CharacterRecord | null> {
  const res = await fetch(`${apiUrl}/${id}`);
  const data = await res.json();
  if (!data.id) return null;
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    species: data.species,
    gender: data.gender,
    image: data.image,
    createdAt: new Date().toISOString(),
    
  };
}

async function createCharacter(values: CharacterMutation): Promise<CharacterRecord> {
  // En la API de Rick and Morty no podemos crear personajes, pero podemos generar un "personaje vacío"
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const newCharacter = { id, createdAt, ...values };
  return newCharacter;
}

async function updateCharacter(id: string, updates: CharacterMutation): Promise<CharacterRecord> {
  const character = await getCharacter(id);
  if (!character) {
    throw new Error(`No character found for ${id}`);
  }
  const updatedCharacter = { ...character, ...updates };
  return updatedCharacter;
}


////////////////////////////////////////////////////////////////////////////////
// Funciones auxiliares para la carga de personajes y búsqueda
export async function getCharacters(query?: string | null) {
  //await new Promise((resolve) => setTimeout(resolve, 500)); // Simulamos un pequeño retraso
  let characters = await getAllCharacters(query);
  if (query) {
    characters = matchSorter(characters, query, {
      keys: ["name"],
    });
  }
  return characters.sort(sortBy("name", "createdAt"));
}

export async function createEmptyCharacter() {
  const character = await createCharacter({});
  return character;
}

export async function getCharacterDetail(id: string) {
  return getCharacter(id);
}

export async function updateCharacterDetails(id: string, updates: CharacterMutation) {
  return updateCharacter(id, updates);
}
