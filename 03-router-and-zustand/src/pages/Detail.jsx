import styles from "./Detail.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import JobSection from "../components/JobSection";
import DetailPageBreadCrumb from "../components/DetailPageBreadCrumb";
import DetailPageHeader, {
	DetailApplyButton,
} from "../components/DetailPageHeader";

export default function JobDetail() {
	const { jobId } = useParams(); // extrae el parámetro de la url.

	const navigate = useNavigate();
	const [job, setJob] = useState(null); // recupera el trabajo y el detalle del trabajo
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// se le hace otra petición a la API para ver los detalles del trabajo seleccionado
	useEffect(() => {
		if (!jobId) return;

		fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
			.then((response) => {
				if (!response.ok) throw new Error("Trabajo no encontrado");
				return response.json();
			})
			.then((json) => {
				// Si la API devuelve { data: { ... } }, extraemos json.data
				// const jobData = json.data ? json.data : json;
				setJob(json);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [jobId]); // cambia cada vez que naveguemos

	if (loading) {
		return (
			<div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
				<div className={styles.loading}>
					<p className={styles.loadingText}>Cargando...</p>
				</div>
			</div>
		);
	}

	// si tenemos un error o no ha habido ningún trabajo
	if (error || !job) {
		return (
			<div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem" }}>
				<div className={styles.error}>
					<h2 className={styles.errorTittle}>Oferta no encontrada</h2>
					<button onClick={() => navigate("/")} className={styles.errorButton}>
						{" "}
						{/** navega al home */}
						Volver al inicio
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* renderizamos los job */}
			<div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
				<DetailPageBreadCrumb job={job} />
				<DetailPageHeader job={job} />
				<DetailApplyButton />

				<JobSection
					title="Descripción del puesto"
					content={job.content?.description}
				/>
				<JobSection
					title="Responsabilidades"
					content={job.content?.responsibilities}
				/>
				<JobSection title="Requisitos" content={job.content?.requirements} />
				<JobSection title="Acerca de la empresa" content={job.content?.about} />
			</div>
		</>
	);
}
