import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
// el useNavigate: nos permite navegar de forma programatica
// el useLocation: nos devuelve la localización actual de la url, donde
// vamos a tener el (path, todos los queryParams, la url completa)

export function useRouter() {
	const navigate = useNavigate();
	const location = useLocation(); //

	// le podemos colocar funciones
	// ✅ Usamos useCallback para que la función mantenga la misma referencia
	const navigateTo = useCallback(
		(path) => {
			navigate(path);
		},
		[navigate],
	);

	return {
		navigateTo,
		currentPath: location.pathname,
	};
}
