import { useEffect, useState } from "react";

export function useRouter() {
	// creamos un customHook
	// los customHook se escriben con la letra use y pueden utilizar otros hooks de react.
	// para recuperar el path actual
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	useEffect(() => {
		const handleLocationChange = () => {
			setCurrentPath(window.location.pathname);
		};

		window.addEventListener("popstate", handleLocationChange);

		// limpiamos el useEffect
		return () => {
			window.removeEventListener("popstate", handleLocationChange);
		};
	}, []);

	// le podemos colocar funciones
	function navigateTo(path) {
		window.history.pushState({}, "", path);
		window.dispatchEvent(new PopStateEvent("popstate"));
	}

	return {
		navigateTo,
		currentPath,
	};
}
