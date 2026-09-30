import { useRouter } from "../hooks/useRouter";

export function Link({ href, children, ...restOfProps }) {
	const { navigateTo } = useRouter();
	// las props que se le van a pasar son: la ruta, el hijo y el resto de props.
	// estamos trabajando con las rutas
	const handleClick = (event) => {
		event.preventDefault();
		navigateTo(href);
		// actualizamos el estado del historial en el windows (ventana)
		// window.history.pushState({}, "", href);
		// // enviamos un evento
		// window.dispatchEvent(new PopStateEvent("popstate"));
		// window.dispatchEvent: dispara un evento sintético global en la ventana principal (window)
		// new PopStateEvent("popstate"): crea un nuevo evento que es un popstate
		// popstate: es un evento especial que nos indica que está cambiando la url.

		// utilizaremos este componente en el Header.
	};
	return (
		<a href={href} {...restOfProps} onClick={handleClick}>
			{children}
		</a>
	);
}
