import styles from "../pages/Detail.module.css";
import { useAuth } from "../context/AuthContext";

export default function DetailPageHeader({ job, children }) {
	return (
		<>
			<header className={styles.header}>
				<h1 className={styles.title}>{job.titulo}</h1>
				<p className={styles.meta}>
					{job.empresa} . {job.ubicacion}
				</p>
			</header>
			{children}
		</>
	);
}

export function DetailApplyButton() {
	const { isLoggedIn } = useAuth();
	return (
		<button disabled={!isLoggedIn} className={styles.applyButton}>
			{isLoggedIn ? "Aplicar ahora" : "Inica sesión para aplicar"}
		</button>
	);
}
