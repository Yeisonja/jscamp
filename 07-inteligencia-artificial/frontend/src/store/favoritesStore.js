import { create } from "zustand";

// zustando devuelve un custom hook para que se pueda leer la store
// la store recibe una función y tiene 2 parámetros, el set(): para actualizar el estado
// y el get(): que es para recuperar el estado
export const useFavoritesStore = create((set, get) => ({
	// get: permite leer el estado dentro del estado.

	// Estado
	favorites: [],

	// limpia los favoritos
	clearFavorites: () => {
		set({ favorites: [] });
	},

	// Acciones
	addFavorite: (jobId) => {
		set((state) => ({
			// revisamos si ya existe en el estado
			favorites: state.favorites.includes(jobId) // vemos si incluye el favorito
				? state.favorites // si lo incluye los devolvemos
				: [...state.favorites, jobId], // si no lo incluye lo agregamos.
		}));
	},

	removeFavorite: (jobId) => {
		// actualiza el estado, recupera el estado
		set((state) => ({
			favorites: state.favorites.filter((id) => id !== jobId),
		}));
	},

	isFavorite: (jobId) => {
		// get(): recupera el estado y entre los favoritos, dime si está el de jobId.
		return get().favorites.includes(jobId);
	},

	toggleFavorite: (jobId) => {
		const { addFavorite, removeFavorite, isFavorite } = get();
		const isFav = isFavorite(jobId);
		isFav ? removeFavorite(jobId) : addFavorite(jobId);
	},

	countFavorites: () => get().favorites.length, // devuelve el total de favoritos.

	// allFavorites: () => {
	// 	return get().favorites; // trae todos los favoritos
	// },
}));
