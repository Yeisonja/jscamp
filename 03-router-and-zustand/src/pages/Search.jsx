import { useEffect } from "react"; // useEffect es un hook que nos permite ejecutar efectos secundarios.
// son operaciones que afectan a algo que está fuera del componente.

import { useState } from "react"; // necesitamos guardar estados.
import { Pagination } from "../components/Pagination";
import { SearchFormSection } from "../components/SearchFormSection";
import { JobListings } from "../components/JobListings";
import { useSearchParams } from "react-router";

// useSearchParams: es un hook que recupera los parámetros de la url.
// necesitamos saber cuántos resultados vamos a tener por página.
const RESULT_PER_PAGE = 4;

// hacemos un custom hook
const useFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	// guardar los filtros y actualizar los filtros
	const [filters, setFilter] = useState(() => {
		// con useSearchParams no hay que llamar a new URLSearchParams
		// const params = new URLSearchParams(window.location.search);
		return {
			technology: searchParams.get("technology") || "",
			location: searchParams.get("type") || "",
			experienceLevel: searchParams.get("level") || "",
		};
	});
	// para guardar el texto filtrado
	const [textToFilter, setTextToFilter] = useState(
		() => searchParams.get("text") || "",
	);

	// página actual y una forma de actualizar en que página estamos.
	const [currentPage, setCurrentPage] = useState(() => {
		const params = new URLSearchParams(window.location.search);
		const page = Number(params.get("page"));
		return Number.isNaN(page) ? page : 1;
	});

	const [jobs, setJobs] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	// hacemos el fetch
	useEffect(() => {
		async function fetchJobs() {
			try {
				setLoading(true);

				// creamos los parámetros
				const params = new URLSearchParams();
				if (textToFilter) params.append("text", textToFilter);
				if (filters.technology) params.append("technology", filters.technology);
				if (filters.location) params.append("type", filters.location);
				if (filters.experienceLevel)
					params.append("level", filters.experienceLevel);

				// paginación: limit y offset
				// limit: es el límite de resultados a mostrar
				// offset: son los resultados a saltar
				// por ejemplo: si queremos la página 2, decimos: ?limit=10&offset=10 -> tráeme 10
				// resultados y saltate esos 10, si la página entrega 10 resultados por página nos
				// enviará a la página que va a contener los 10 resultados siguientes
				// si decimos: ?limit=10&offset=20 -> limite de 10 y saltate los 20 primeros, nos envía a la página 3

				const offset = (currentPage - 1) * RESULT_PER_PAGE;
				params.append("limit", RESULT_PER_PAGE);
				params.append("offset", offset);

				// esta constante: queryParams la vamos a pasar a la url
				const queryParams = params.toString(); // todos los parámetros los convertimos en string

				// simulamos un delay de 5s
				// await new Promise((resolve) => setTimeout(resolve, 5000));
				const response = await fetch(
					`https://jscamp-api.vercel.app/api/jobs?${queryParams}`,
				);
				const json = await response.json();
				setJobs(json.data);
				setTotal(json.total);
			} catch (error) {
				console.error("Ha habido un problema obteniendo los datos: ", error);
			} finally {
				setLoading(false);
			}
		}
		// ejecutamos la función, es buena práctica ejecutarla dentro del useEffect
		fetchJobs();
		// cada vez que cambien: los filtros, el texto filtrado y la página actual
		// haz una llamada a la API para recuperar los resultados.
	}, [filters, textToFilter, currentPage]);

	// cada vez que cambien ciertos parámetros, escucha los cambios y reflejarlos en la url.
	useEffect(() => {
		setSearchParams((params) => {
			if (textToFilter) {
				params.set("text", textToFilter);
			} else {
				params.delete("text");
			}
			if (filters.technology) params.set("technology", filters.technology);
			if (filters.location) params.set("type", filters.location);
			if (filters.experienceLevel) params.set("level", filters.experienceLevel);

			// si estamos en la página que sea mayor a la actual la colocamos como parámetro en la url.
			if (currentPage > 1) params.set("page", currentPage);

			return params;
		});
	}, [filters, textToFilter, currentPage, setSearchParams]);

	const totalPages = Math.ceil(total / RESULT_PER_PAGE);
	// Math.ceil(): siempre redondea hacia arriba.

	// creamos un método en el padre
	// el método recibe la página
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// creamos la función de búsqueda
	const handleSearch = (filters) => {
		setFilter(filters);
		setCurrentPage(1); // reseteamos la página
	};

	// creamos la función para filtrar texto
	const handleTextFilter = (newTextToFilter) => {
		setTextToFilter(newTextToFilter); // actualiza el texto filtrado.
		// cada vez que filtremos tenemos que resetear la paginación.
		setCurrentPage(1); // resetear los estados de búsqueda.
	};

	return {
		loading,
		jobs,
		total,
		totalPages,
		currentPage,
		textToFilter,
		handlePageChange,
		handleSearch,
		handleTextFilter,
	};
};

export default function SearchPage() {
	const {
		jobs,
		total,
		loading,
		totalPages,
		// pagedResults,
		currentPage,
		textToFilter,
		handlePageChange,
		handleSearch,
		handleTextFilter,
	} = useFilters();

	// al useEffect le pasamos una función que se va a ejecutar cada vez que el efecto necesite ser llamado.
	useEffect(() => {
		document.title = `Resultados: ${total}, Página ${currentPage} - DevJobs`;
	}, [total, currentPage]); // []: indica que se ejecute solo la primera vez
	// []: el parametro que coloquemos aquí es el control de cuándo se va a ejecutar la función.

	// otro ejemplo de useEffect
	// useEffect(() => {
	// 	// suscripción a un evento
	// 	const handleResize = () => {
	// 		console.log("Ventana Redimensionada");
	// 		console.log(window.innerHeight, window.innerWidth);
	// 	};

	// 	window.addEventListener("resize", handleResize);

	// 	// limpieza: se ejecuta antes de desmontar o antes de re-ejecutar.
	// 	return () => {
	// 		window.removeEventListener("resize", handleResize);
	// 	};
	// }, []);

	return (
		<main>
			<SearchFormSection
				initialText={textToFilter}
				onSearch={handleSearch}
				onTextFilter={handleTextFilter}
			/>

			<section>
				{/* JobListings: es el componente hijo encargado de renderizar la lista de empleos. */}
				{/* jobs: es el nombre de la prop, se le envía al componente hijo. */}
				{/* pagedResults: es el valor real que se le envía al componente hijo. es una variable tipo array. */}
				{/* le pasa el recorte de 5 empleos */}
				<h2 style={{ textAlign: "center" }}>Resultados de búsqueda: {total}</h2>

				{loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs} />}

				<Pagination
					// le pasa qué página pintar como activa y cuántas hay en total.
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
				{/* se le está diciendo a la paginación que cuando cambie la página ejecute la función. */}
			</section>
		</main>
	);
}
