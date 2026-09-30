import { useEffect } from "react"; // useEffect es un hook que nos permite ejecutar efectos secundarios.
// son operaciones que afectan a algo que está fuera del componente.

import { useState } from "react"; // necesitamos guardar estados.
import { Pagination } from "../components/Pagination";
import { SearchFormSection } from "../components/SearchFormSection";
import { JobListings } from "../components/JobListings";
import { useRouter } from "../hooks/useRouter";
// import jobsData from "../data.json";

// necesitamos saber cuántos resultados vamos a tener por página.
const RESULT_PER_PAGE = 4;

// hacemos un custom hook
const useFilters = () => {
	// guardar los filtros y actualizar los filtros
	const [filters, setFilter] = useState(() => {
		const params = new URLSearchParams(window.location.search);
		return {
			technology: params.get("technology") || "",
			location: params.get("type") || "",
			experienceLevel: params.get("level") || "",
		};
	});
	// para guardar el texto filtrado
	const [textToFilter, setTextToFilter] = useState(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get("text") || "";
	});

	// página actual y una forma de actualizar en que página estamos.
	const [currentPage, setCurrentPage] = useState(() => {
		const params = new URLSearchParams(window.location.search);
		const page = Number(params.get("page"));
		return Number.isNaN(page) ? page : 1;
	});

	const [jobs, setJobs] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	const { navigateTo } = useRouter();

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
		const params = new URLSearchParams();
		if (textToFilter) params.append("text", textToFilter);
		if (filters.technology) params.append("technology", filters.technology);
		if (filters.location) params.append("type", filters.location);
		if (filters.experienceLevel)
			params.append("level", filters.experienceLevel);

		// si estamos en la página que sea mayor a la actual la colocamos como parámetro en la url.
		if (currentPage > 1) params.append("page", currentPage);

		// construimos la nueva url
		const newUrl = params.toString()
			? `${window.location.pathname}?${params.toString()}`
			: window.location.pathname;
		// si la nueva url tiene parámetros se le agrega esa url con la ruta y los parámetros
		// de lo contrario solo le agrega la ruta
		navigateTo(newUrl);
	}, [filters, textToFilter, currentPage, navigateTo]);
	// nota: la paginación es recomendable hacerla en la API por mótivos de seguridad y rendimiento.
	// filtramos utilizando la tecnología.
	// const jobsFilteredByFilters = jobsData.filter((job) => {
	// 	return (
	// 		filters.technology === "" || job.data.technology === filters.technology
	// 	);
	// filtrar por tecnología, ubicación y experiencia
	// const matchTech =
	// 	filters.technology === "" || job.data.technology === filters.technology;
	// const matchLocation =
	// 	filters.location === "" || job.ubicacion === filters.location;
	// const matchExperience =
	// 	filters.experienceLevel === "" ||
	// 	job.data.nivel === filters.experienceLevel;

	// return matchTech || matchLocation || matchExperience;
	// });

	// filtramos por ubicación
	// const jobsFilteredByLocation = jobsData.filter((job) => {
	// 	return filters.location === "" || job.ubicacion === filters.location;
	// });

	// const jobsWithTextFilterLocation =
	// console.log(jobsFilteredByLocation);

	// primero filtramos y luego paginamos
	// si el textToFilter es vacío, trae los jobsFilteredByFilters, sino filtra y devuelve el
	// titulo que incluya el textToFilter en minúsculas.
	// const jobsWithTextFilter =
	// 	textToFilter === ""
	// 		? jobsFilteredByFilters
	// 		: jobsData.filter((job) => {
	// 				return job.titulo.toLowerCase().includes(textToFilter.toLowerCase());
	// 			});
	// console.log(jobsWithTextFilter);
	const totalPages = Math.ceil(total / RESULT_PER_PAGE);
	// Math.ceil(): siempre redondea hacia arriba.

	// ahora vamos a filtrar los empleos por página.
	// utilizamos el método slice para cortar
	// const pagedResults = jobsWithTextFilter.slice(
	// 	(currentPage - 1) * RESULT_PER_PAGE, // Página 1 -> 0, Página 2 -> 5, Página 3 -> 10
	// 	currentPage * RESULT_PER_PAGE, // Página 1 -> 5, Página 2 -> 10, Página 3 -> 15
	// );

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

export function SearchPage() {
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
