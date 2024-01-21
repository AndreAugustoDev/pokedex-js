const pokemonList = getElement("#pokemonList");
const loadMoreButton = getElement("#loadMoreButton");

let offset = 0;
const limit = 12;
let maxRecords = 151;

const convertPokemonToLi = (pokemon) => `
  <li class="pokemon ${pokemon.type}">
		<div class="info">
			<span class="name">${pokemon.name}</span>
			<span class="id">#${pokemon.id}</span>
		</div>
    <div class="detail">
      <ol class="types">
        ${pokemon.types
					.map((type) => `<li class="type ${type}">${type}</li>`)
					.join("")}
      </ol>
      <img class="sprite" src="${pokemon.sprite}" alt="${pokemon.name}">
    </div>
		<div class="url" id="${pokemon.url}"></div>
  </li>
`;

const loadMorePokemon = async (offset, limit) => {
	try {
		const pokemon = (await pokeApi.getPokemon(offset, limit)) || [];
		const newPokemonList = pokemon.map(convertPokemonToLi).join("");
		pokemonList.innerHTML += newPokemonList;
	} catch (error) {
		console.log(error);
	}
};

maxRecords = pokeApi.getPokemonCount();

document.addEventListener(
	"DOMContentLoaded",
	async () => await loadMorePokemon(offset, limit),
);

document.addEventListener("click", (event) => {
	if (event.target === loadMoreButton) {
		offset += limit;
		const totalRecordsNextPage = offset + limit;
		if (totalRecordsNextPage >= maxRecords) {
			const newLimit = maxRecords - offset;
			loadMorePokemon(offset, newLimit);
			event.target.parentElement.removeChild(event.target);
		} else {
			loadMorePokemon(offset, limit);
		}
	}
});

pokemonList.addEventListener("click", (event) => {
	const target = event.target.closest(".pokemon");
	if (target) {
		const url = target.querySelector(".url").id;
		localStorage.setItem("pokemonUrl", url);
		window.location.href = "details.html";
	}
});
