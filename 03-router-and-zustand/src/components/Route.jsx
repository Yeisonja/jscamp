import { useRouter } from "../hooks/useRouter";

export function Route({ path, component: Component }) {
	// utilizamos el custom hook
	const { currentPath } = useRouter();

	if (currentPath !== path) return null;

	return <Component />;
}
