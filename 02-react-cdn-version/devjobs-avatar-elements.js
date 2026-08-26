// Web Components.
// creamos una clase
// extends HTMLElement: indica que va a ser una clase de la familia de html.
class DevjobsAvatar extends HTMLElement {
	constructor() {
		super(); // llama al constructor de HTMLElement.

		// es necesario encapsular el componente para que los estilos de fuera no le afecten.
		// para hacerlo es necesario activar el modo shadow dom en el constructor.
		this.attachShadow({ mode: "open" });
	}

	// creamos una función
	createUrl(service, username) {
		return `https://unavatar.io/${service}/${username}`;
	}

	// es necesario renderizar.
	render() {
		// recuperamos los elementos del componente devjobs-avatar.
		// ??: significa que si devuelve null o undefined entonces asigna el valor de la derecha.
		const service = this.getAttribute("service") ?? "github";
		const username = this.getAttribute("username") ?? "yeison";
		const size = this.getAttribute("size") ?? 32;
		console.log(username, service, size);

		// creamos la url
		const url = this.createUrl(service, username);

		this.shadowRoot.innerHTML = `
      <img src="${url}" 
      alt="Avatar de ${username}"
      class="avatar"
      style="width: ${size}px; height: ${size}px; border-radius: 50%"
      />
    `;
	}

	// indica que cuando el componente se añada al DOM en html, entonces llamamos al metodo render()
	connectedCallback() {
		this.render();
	}
}

// es necesario registrar el componente.
customElements.define("devjobs-avatar", DevjobsAvatar);
