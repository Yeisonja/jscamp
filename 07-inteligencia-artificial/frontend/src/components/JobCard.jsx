import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";
import styles from "./JobCard.module.css";
import { Link } from "./Link";
// crear nuestro primer componente JobCard

import { useState } from "react";

function JobCardFavoriteButton({ jobId }) {
	const { toggleFavorite, isFavorite } = useFavoritesStore();
	const { isLoggedIn } = useAuthStore();

	return (
		<button
			disabled={!isLoggedIn}
			onClick={() => toggleFavorite(jobId)}
			aria-label={
				isFavorite(jobId) ? "Remove from favorites" : "Add to favorites"
			}
		>
			{isFavorite(jobId) ? "💖" : "🤍"}
		</button>
	);
}

function JobCardApplyButton({ jobId }) {
	const [isApplied, setIsApplied] = useState(false);

	const { isLoggedIn } = useAuthStore();

	const handleApplyClick = () => {
		console.log("Aplicando al trabajo", jobId);
		setIsApplied(true);
	};

	const buttonClasses = isApplied
		? "button-apply-job is-applied"
		: "button-apply-job";
	const buttonText = isApplied ? "Aplicado" : "Aplicar";

	return (
		<button
			disabled={!isLoggedIn}
			className={buttonClasses}
			onClick={handleApplyClick}
		>
			{buttonText}
		</button>
	);
}

// e importarlo para su uso en App.jsx
export function JobCard({ job }) {
	return (
		<article
			className="job-listing-card"
			data-modalidad={job.data?.modadalidad}
			data-nivel={job.data?.nivel}
			data-technology={job.data?.technology}
		>
			<div>
				<h3>
					<Link className={styles.title} to={`/jobs/${job.id}`}>
						{job.titulo}
					</Link>
				</h3>
				<small>
					{job.empresa} | {job.ubicacion}
				</small>
				<p>{job.descripcion}</p>
			</div>

			<div className={styles.actions}>
				<Link to={`/jobs/${job.id}`} className={styles.details}>
					Ver detalles
				</Link>
				<JobCardApplyButton jobId={job.id} />
				<JobCardFavoriteButton jobId={job.id} />
			</div>
		</article>
	);
}
