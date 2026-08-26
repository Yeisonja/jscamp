import { useId } from "react";
// useId es un hook que lo que hace es crear identificadores que pueden ser reutilizados y no van a replicarse.

export function SearchFormSection({ onSearch, onTextFilter }) {
	// seteamos los name de los input y select con useId.
	const idText = useId();
	const idTechnology = useId();
	const idLocation = useId();
	const idExperienceLevel = useId();

	// hacemos una función para el formulario
	const handleSubmit = (event) => {
		event.preventDefault();
		// recuperar la información de los name del formulario
		const formData = new FormData(event.target);

		const filters = {
			technology: formData.get(idTechnology),
			location: formData.get(idLocation),
			experienceLevel: formData.get(idExperienceLevel),
		};

		// forma de aplicar a los filtros
		onSearch(filters);
	};

	// creamos otra función para los filtros
	const handleTextChange = (event) => {
		// vamos a recuperar el texto
		const text = event.target.value;
		onTextFilter(text);
	};

	return (
		<section className="jobs-search">
			<h1>Encuentra tu próximo trabajo</h1>
			<p>Explora miles de oportunidades en el sector tecnológico.</p>
			<form onSubmit={handleSubmit} id="empleos-search-form" role="search">
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
						name={idText}
						id="empleos-search-input"
						type="text"
						placeholder="Buscar trabajos, empresas o habilidades"
						onChange={handleTextChange} // cuando cambie el input
					/>

					<button className="nuevoBoton" type="submit">
						Buscar
					</button>
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
