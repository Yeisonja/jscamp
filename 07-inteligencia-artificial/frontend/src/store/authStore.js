import { create } from "zustand";

// create: nos va a permitir crear el store, es decir, donde vamos a guardar nuestros datos.

// devolvemos un custom hook, que recibe una función que se va a actualizar con el parámetro set.
export const useAuthStore = create((set) => ({
	// Estado
	isLoggedIn: false,

	// Acciones
	login: () => set({ isLoggedIn: true }),
	logout: () => set({ isLoggedIn: false }),
}));
