import styles from "../pages/Detail.module.css";
import snarkdown from "snarkdown";
// el hook useParams: nos permite recuperar los parámetros de la url.

export default function JobSection({ title, content }) {
	const html = snarkdown(content || ""); // convierte lenguaje markdown a html.
	{
		/* el content es un markdown, por tanto es necesario descargar snarkdown para
		transformarlo a html. */
	}
	return (
		<section className={styles.section}>
			<h2 className={styles.sectionTittle}>{title}</h2>
			<div
				className={`${styles.sectionContent} prose`}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</section>
	);
}
