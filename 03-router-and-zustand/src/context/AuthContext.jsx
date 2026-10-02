import { useContext } from "react";
import { createContext, useState } from "react";

// createContext: es una API de react que permite crear un estado global
// que es accesible desde cualquier componente sin necesidad de pasar props
// manualmente en cada nivel.

// creamos el contexto
// cuando tengamos el contexto necesitamos dos cosas: 1ero. el provedor, que va a ser el que tiene la
// información, quién la provee; y 2do. el consumidor, quién consume esa información.
export const AuthContext = createContext();

// creamos el proveedor
// el proveedor tiene que envolver la aplicación
export function AuthProvider({ children }) {
	// agregar autenticación
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// función para decirle cuando tiene que iniciar sesión o no
	const login = () => {
		setIsLoggedIn(true);
	};
	// función para hacer el loggout
	const logout = () => {
		setIsLoggedIn(false);
	};

	// vamos a guardarlo
	const value = {
		isLoggedIn,
		login,
		logout,
	};
	// el contexto tiene que envolver la parte de la aplicación que queremos que pueda utilizar estos datos.
	return <AuthContext value={value}>{children}</AuthContext>;
	// es necesario envolver el children porque eso mismo hay que hacer en el punto de entrada de nuestra aplicación.
}

// createContext(): crea el contexto que va a contener el estado global
// AuthContext: es el contexto que hay que exportar para poder consumirlo en los componentes
// AuthProvider(): es el componente que va a envolver la parte de nuestra aplicación y va a proveer los valores que
// queremos leer.

// es mejor práctica hacer el contexto con un custom hook
export function useAuth() {
	const context = useContext(AuthContext);

	// podemos validar si el contexto está envuelto con el provider
	if (context === undefined) {
		throw new Error("El useAuth debe estar dentro del provider.");
	}
	return context;
}
