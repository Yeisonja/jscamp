import { useState } from "react"; // necesitamos guardar estados.
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Pagination } from "./components/Pagination";
import { SearchFormSection } from "./components/SearchFormSection";
import { JobListings } from "./components/JobListings";
import jobsData from "./data.json";

// nota: la paginación es recomendable hacerla en la API por mótivos de seguridad y rendimiento.

// necesitamos saber cuántos resultados vamos a tener por página.
const RESULT_PER_PAGE = 5;

function App() {
	// guardar los filtros y actualizar los filtros
	const [filters, setFilter] = useState({
		technology: "",
		location: "",
		experienceLevel: "",
	});
	// para guardar el texto filtrado
	const [textToFilter, setTextToFilter] = useState("");

	// página actual y una forma de actualizar en que página estamos.
	const [currentPage, setCurrentPage] = useState(1);

	const jobsFilteredByFilters = jobsData.filter((job) => {
		return (
			filters.technology === "" || job.data.technology === filters.technology
		);
	});

	// primero filtramos y luego paginamos
	const jobsWithTextFilter =
		textToFilter === ""
			? jobsFilteredByFilters
			: jobsData.filter((job) => {
					return job.titulo.toLowerCase().includes(textToFilter.toLowerCase());
				});

	const totalPages = Math.ceil(jobsWithTextFilter.length / RESULT_PER_PAGE);
	// Math.ceil(): siempre redondea hacia arriba.

	// ahora vamos a filtrar los empleos por página.
	const pagedResults = jobsWithTextFilter.slice(
		(currentPage - 1) * RESULT_PER_PAGE, // Página 1 -> 0, Página 2 -> 5, Página 3 -> 10
		currentPage * RESULT_PER_PAGE, // Página 1 -> 5, Página 2 -> 10, Página 3 -> 15
	);

	// creamos un método en el padre
	// el método recibe la página
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// creamos la función de búsqueda
	const handleSearch = (filters) => {
		setFilter(filters);
		setCurrentPage(1);
	};

	// creamos la función para filtrar texto
	const handleTextFilter = (newTextToFilter) => {
		setTextToFilter(newTextToFilter); // actualiza el texto filtrado.
		// cada vez que filtremos tenemos que resetear la paginación.
		setCurrentPage(1); // resetear los estados de búsqueda.
	};

	return (
		<>
			<Header />

			<main>
				<SearchFormSection
					onSearch={handleSearch}
					onTextFilter={handleTextFilter}
				/>

				<section>
					<JobListings jobs={pagedResults} />

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
					{/* se le está diciendo a la paginación que cuando cambie la página ejecute la función. */}
				</section>
			</main>

			<Footer />
		</>
	);
}

export default App;
