import { useId, useState, useRef } from "react";
// useId es un hook que lo que hace es crear identificadores únicos que pueden ser reutilizados.

// creamos un custom hook para el filtrado del formulario de trabajos.
const useSearchForm = ({
	onSearch,
	idText,
	onTextFilter,
	idTechnology,
	idLocation,
	idExperienceLevel,
}) => {
	// vamos a usar otro hook llamado useRef, que es como una caja donde se puede guardar
	// cualquier valor que necesita recordar y que no afecta a la interfaz, es decir, que va
	// a evitar que se siga renderizando la interfaz, y cuando ese valor guardado con useRef cambie
	// no haga un nuevo renderizado.

	// hacemos un timeout para controlar las llamadas a la API
	const timeOutId = useRef(null);
	const [searchText, setSearchText] = useState("");

	// hacemos una función para el formulario
	const handleSubmit = (event) => {
		console.log("submit");
		event.preventDefault();

		// event.target !== event.currentTarget
		// event.target: es el elemento que está recibiendo el evento.
		// event.currentTarget: es el elemento que está escuchando el evento.
		// event.target es el input quién escucha.
		// event.currentTarget es el formulario quién escucha.

		if (event.target.name === idText) return; // ya lo manejamos en el onChange

		// recuperar la información de los name del formulario
		const formData = new FormData(event.currentTarget);

		const filters = {
			technology: formData.get(idTechnology),
			location: formData.get(idLocation),
			experienceLevel: formData.get(idExperienceLevel),
		};

		// forma de aplicar a los filtros
		onSearch(filters);
	};

	// creamos otra función para los filtros
	// va a funcionar cuando le introduzcamos textos en el input.
	const handleTextChange = (event) => {
		// vamos a recuperar el texto
		const text = event.target.value;
		setSearchText(text); // actualizamos el input

		if (timeOutId.current) {
			clearInterval(timeOutId.current);
		}
		// DEBOUNCE: cancelar el timeout anterior
		timeOutId.current = setTimeout(() => {
			onTextFilter(text);
		}, 500);
	};

	return {
		handleTextChange,
		handleSubmit,
		searchText,
	};
};

export function SearchFormSection({ onSearch, onTextFilter, initialText }) {
	// seteamos los name de los input y select con useId.
	const idText = useId();
	const idTechnology = useId();
	const idLocation = useId();
	const idExperienceLevel = useId();

	// useRef es la forma práctica que tiene react de acceder a elementos del Dom
	// es mala práctica acceder de la forma tradicional en react.
	const inputRef = useRef(); // useRef se puede utilizar con elementos html

	const { handleSubmit, handleTextChange } = useSearchForm({
		onSearch,
		idText,
		onTextFilter,
		idTechnology,
		idLocation,
		idExperienceLevel,
	});

	const handleInputChange = (event) => {
		event.preventDefault();
		console.log(inputRef);

		inputRef.current.value = "";
		onTextFilter("");
	};

	return (
		<section className="jobs-search">
			<h1>Encuentra tu próximo trabajo</h1>
			<p>Explora miles de oportunidades en el sector tecnológico.</p>
			<form onChange={handleSubmit} id="empleos-search-form" role="search">
				<div className="search-bar">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.25"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="icon icon-tabler icons-tabler-outline icon-tabler-search"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
						<path d="M21 21l-6 -6" />
					</svg>

					<input
						ref={inputRef}
						name={idText}
						id="empleos-search-input"
						type="text"
						placeholder="Buscar trabajos, empresas o habilidades"
						onChange={handleTextChange} // cuando cambie el input
						defaultValue={initialText} // el valor por defecto es el initialText
					/>

					<button onClick={handleInputChange}>❌</button>
				</div>

				<div className="search-filters">
					<select name={idTechnology} id="filter-technology">
						<option value="">Tecnología</option>
						<option value="javascript">JavaScript</option>
						<option value="python">Python</option>
						<option value="java">Java</option>
						<option value="react">React</option>
						<option value="nodejs">Node.js</option>
					</select>

					<select name={idLocation} id="filter-location">
						<option value="">Ubicación</option>
						<option value="remoto">Remoto</option>
						<option value="cdmx">Ciudad de México</option>
						<option value="guadalajara">Guadalajara</option>
						<option value="monterrey">Monterrey</option>
						<option value="barcelona">Barcelona</option>
					</select>

					<select name={idExperienceLevel} id="filter-experience-level">
						<option value="">Nivel de experiencia</option>
						<option value="junior">Junior</option>
						<option value="mid">Mid-level</option>
						<option value="senior">Senior</option>
						<option value="lead">Lead</option>
					</select>
				</div>
			</form>

			<span id="filters-selected-value"></span>
		</section>
	);
}
