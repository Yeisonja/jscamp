import { createContext, useState, useContext } from "react";

// es un contexto para guardar favoritos
// creamos el contexto
export const FavoritesContext = createContext();

// creamos el proveedor
export function FavoritesProvider({ children }) {
	const [favorites, setFavorites] = useState([]);

	const addFavorite = (job) => {
		// el spread operator: copia los favoritos previos y coloca el nuevo favorito.
		setFavorites((prevFavorites) => [...prevFavorites, job]);
	};

	const removeFavorite = (jobId) => {
		setFavorites((prevFavorites) => {
			// conserva en la lista todos los trabajos cuyo id no sea igual al id
			// que quiero eliminar.
			return prevFavorites.filter((job) => job.id !== jobId);
		});
	};

	const isFavorite = (jobId) => {
		return favorites.some((job) => job.id === jobId);
	};

	const value = {
		favorites,
		addFavorite,
		removeFavorite,
		isFavorite,
	};
	return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

// creamos el custom hook
export function useFav() {
	const context = useContext(FavoritesContext);

	if (context === undefined) {
		throw new Error("El useFav debe estar dentro del provider.");
	}
	return context;
}
