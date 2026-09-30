import { JobCard } from "./JobCard";

export function JobListings({ jobs }) {
	// recibe la prop: jobs
	return (
		<>
			<div className="jobs-listings">
				{jobs.length === 0 && (
					<p
						style={{
							textAlign: "center",
							padding: "20px",
							textWrap: "balance",
						}}
					>
						No se han encontrado empleos que coincidan con el criterio de
						búsqueda.
					</p>
				)}
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
