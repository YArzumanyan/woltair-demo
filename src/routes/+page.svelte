<script>
	import { cars, uid, afterSubmit } from '../lib/stores.js';
	import { afterUpdate } from 'svelte';

	let car = {};
	let fileinput;
	let focusedItem;

	afterUpdate(() => {
		if ($afterSubmit) {
			focusedItem = $cars.find((item) => item.uid == $afterSubmit.uid);
			$afterSubmit = null;
			if (focusedItem) {
				let elem = document.getElementById('cars_list_' + focusedItem.uid);
				elem && elem.focus();
			}
		}
	});

	const handleSubmit = (e) => {
		$cars = [
			...$cars,
			{
				uid: $uid,
				...car
			}
		];

		$afterSubmit = $cars.find((item) => item.uid == $uid);
		$uid++;
	};

	const onFileSelected = (e) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			car.avatar = e.target.result;
		};
	};

	const handleItemFocus = (item = null) => {
		focusedItem = item;
	};

	const handleRemoveCar = (item) => {
		$cars = $cars.filter((value) => value.uid != item.uid);
		focusedItem = null;
	};
</script>

<main class="main">
	<form on:submit|preventDefault={handleSubmit} id="cars_form">
		<div class="cars_form-inputs">
			<div>
				<label for="cars_brand">Značka:</label>
				<input bind:value={car.brand} id="cars_brand" placeholder="Značka" required />
			</div>

			<div>
				<label for="cars_model">Model:</label>
				<input bind:value={car.model} id="cars_model" placeholder="Model" required />
			</div>

			<div>
				<label for="cars_year">Rok výroby:</label>
				<input bind:value={car.year} id="cars_year" placeholder="Rok výroby" required />
			</div>

			<div>
				<label for="cars_image">Obrázek:</label>
				<button on:click|preventDefault={() => fileinput.click()}>Vložit obrázek</button>
				<input
					type="file"
					style="display:none"
					accept=".jpg, .jpeg, .png"
					on:change={(e) => onFileSelected(e)}
					bind:this={fileinput}
				/>
			</div>
		</div>
		<div class="cars_form-submit">
			<input type="submit" value="Vložit" />
		</div>
	</form>

	<div class="cars-content">
		<div id="cars_list">
			{#each $cars as item}
				<div>
					<div
						tabindex="1"
						id={`cars_list_${item.uid}`}
						class="cars_list-item"
						on:focus={() => handleItemFocus(item)}
					>
						{`${item.brand} ${item.model} ${item.year}`}
					</div>
					<button on:click={() => handleRemoveCar(item)}>X</button>
				</div>
			{/each}
		</div>

		<div id="cars_details">
			{#if focusedItem}
				<h3>Detail vozidla</h3>
				<img
					src={focusedItem.avatar ? focusedItem.avatar : '/car_placeholder.png'}
					alt="The selected car"
				/>
				<p>{`${focusedItem.brand} ${focusedItem.model} ${focusedItem.year}`}</p>
				<button on:click={() => handleRemoveCar(focusedItem)}>Smazat</button>
			{/if}
		</div>
	</div>
</main>

<style>
	.cars_list-item:hover {
		background-color: #cad2c5;
		cursor: pointer;
	}

	.cars_list-item:focus {
		background-color: #84a98c;
		padding: 0 5px;
		border: 1px solid #52796f;
		border-radius: 5px;
	}

	.main {
		display: flex;
		flex-direction: column;
		max-width: 1000px;
		margin: auto;
	}

	#cars_form {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		border: 1px solid black;
		padding: 10px;
	}

	.cars_form-inputs {
		display: flex;
		align-items: stretch;
		flex-direction: column;
		gap: 10px;
	}

	.cars_form-inputs div {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	.cars_form-submit {
		margin-top: auto;
	}

	.cars-content {
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		border-left: 1px solid black;
		display: flex;
	}

	#cars_list {
		border-right: 1px solid black;
		display: flex;
		flex-direction: column;
		padding: 10px;
		gap: 10px;
		max-width: 400px;
		word-break: break-all;
	}

	#cars_list div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}

	#cars_details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10px;
		margin: auto;
		word-break: break-all;
		max-width: 400px;
	}

	#cars_details button {
		align-self: flex-end;
	}
</style>
