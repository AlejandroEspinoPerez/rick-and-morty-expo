const BASE_URL = 'https://rickandmortyapi.com/api';

export async function fetchCharacters(page: number = 1) {
    try {
        const response = await fetch(`${BASE_URL}/character?page=${page}`);
        const data = await response.json();
        return {
            characters: data.results,
            nextPage: data.info.next ? page + 1 : null, // Guarda la próxima página si existe
        };
    } catch (error) {
        console.error("Error fetching characters:", error);
        return { characters: [], nextPage: null };
    }
}

export async function fetchCharacterDetails(characterId: number) {
    try {
        const response = await fetch(`${BASE_URL}/character/${characterId}`);
        const data = await response.json();

        // Obtener detalles de los episodios (solo los primeros 5 para evitar muchas peticiones)
        const episodeUrls = data.episode.slice(0, 5); // Limita a 5 episodios
        const episodeResponses = await Promise.all(episodeUrls.map(url => fetch(url)));
        const episodes = await Promise.all(episodeResponses.map(res => res.json()));

        return { ...data, episodes }; // Agregar episodios a la respuesta
    } catch (error) {
        console.error("Error fetching character details:", error);
        return null;
    }
}
