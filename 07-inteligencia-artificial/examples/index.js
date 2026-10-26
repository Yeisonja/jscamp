function sum(a, b) {
	return a + b;
}

function multiply(a, b) {
	return a * b;
}

// conectarse a la pokeapi con la IA
async function getPokemon(name) {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
	);

	if (!response.ok) {
		const error = new Error(`No se pudo encontrar el Pokémon: ${name}`);
		error.status = response.status === 404 ? 404 : 502;
		throw error;
	}

	return response.json();
}

module.exports = {
	sum,
	multiply,
	getPokemon,
};

// nivel básico de la IA: el autocompletado
// la IA de vscode también funciona como nivel básico.
