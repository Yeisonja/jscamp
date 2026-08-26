import { JobCard } from "./JobCard";

export function JobListings({ jobs }) {
	// le pasa la prop: jobs
	return (
		<>
			<h2>Resultados de búsqueda</h2>

			<div className="jobs-listings">
				{/* iteramos con map 
					es mejor utilizar map a un forEach, porque map
					devuelve un nuevo array. */}
				{jobs.map((job) => (
					// cuando se renderiza una lista es necesario identificar por medio de una key única.
					// de ahí el key={job.id}.
					<JobCard key={job.id} job={job} />
				))}
			</div>
		</>
	);
}
