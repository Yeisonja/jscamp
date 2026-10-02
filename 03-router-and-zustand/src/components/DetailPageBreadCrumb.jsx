import styles from "../pages/Detail.module.css";
import { Link } from "../components/Link";

export default function DetailPageBreadCrumb({ job }) {
	return (
		<div className={styles.container}>
			{/* arriba aparece el breadcrumb */}
			<nav className={styles.breadcrumb}>
				<Link to="/search" className={styles.breadcrumbButton}>
					Empleos
				</Link>
				<span className={styles.breadcrumbSeparator}>/</span>
				<span className={styles.breadcrumbCurrent}>{job.titulo}</span>
			</nav>
		</div>
	);
}
