import styles from "./Pagination.module.css";

// props: propiedades
export function Pagination({ currentPage, totalPages, onPageChange }) {
	// generar un array de páginas a mostrar.
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // trae el total de las páginas.
	// el Array.from: lo que hace es recibir dos parametros, el primero, en este caso es un array
	// y el segundo parametro se le puede pasar una función para inicializar cada uno de los elementos.
	// ejemplo: Array.from({ length: 10 }, (_, index) => index + 1);

	// creamos una función del click a la flechita previa.
	const handlePrevClick = (event) => {
		event.preventDefault();
		if (!isFirstPage) {
			onPageChange(currentPage - 1);
		}
	};

	// flecha derecha
	const handleNextClick = (event) => {
		event.preventDefault();
		if (!isLastPage) {
			onPageChange(currentPage + 1);
		}
	};

	// método para cambiar la página
	const handleChangePage = (event, page) => {
		event.preventDefault();
		if (page !== currentPage) {
			onPageChange(page);
		}
	};
	// configurar cómo se muestran las páginas
	const isFirstPage = currentPage === 1; // si la página actual es 1
	const isLastPage = currentPage === totalPages; // si la página actual es la última página, es decir, 10

	// vamos a cambiar los estilos
	const stylePrevButton = isFirstPage
		? { pointerEvents: "none", opacity: 0.5 }
		: {};
	const styleNextButton = isLastPage
		? { pointerEvents: "none", opacity: 0.5 }
		: {};

	return (
		<nav className={styles.pagination}>
			<a href="#" style={stylePrevButton} onClick={handlePrevClick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M15 6l-6 6l6 6" />
				</svg>
			</a>

			{/* iteramos el array con map */}
			{pages.map((page) => (
				<a
					key={page}
					href="#"
					className={currentPage === page ? styles.isActive : ""}
					onClick={(event) => handleChangePage(event, page)}
				>
					{page}
				</a>
			))}

			<a href="#" style={styleNextButton} onClick={handleNextClick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M9 6l6 6l-6 6" />
				</svg>
			</a>
		</nav>
	);
}
