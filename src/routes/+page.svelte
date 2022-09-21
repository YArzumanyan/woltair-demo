<script>
	import { cars, uid, afterSubmit } from '$lib/stores.js';
	import { afterUpdate } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let car = {};
	let fileinput;
	let focusedItem;
	let outroEnd = true;

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
	<div class="content-box">
		<div id="cars_form">
			<form on:submit|preventDefault={handleSubmit} class="cars_form-inputs">
				<div>
					<label for="cars_brand">Značka:</label>
					<input type="text" bind:value={car.brand} id="cars_brand" placeholder="Značka" required />
				</div>
	
				<div>
					<label for="cars_model">Model:</label>
					<input type="text" bind:value={car.model} id="cars_model" placeholder="Model" required />
				</div>
	
				<div>
					<label for="cars_year">Rok výroby:</label>
					<input type="number" bind:value={car.year} id="cars_year" placeholder="Rok výroby" required />
				</div>
	
				<div>
					<label for="cars_image">Obrázek:</label>
					<span class="file-input-text" on:click={() => fileinput.click()}>Vložit obrázek</span>
					<input
						id="cars_image"
						type="file"
						style="display:none"
						accept=".jpg, .jpeg, .png"
						on:change={(e) => onFileSelected(e)}
						bind:this={fileinput}
					/>
				</div>
			</form>
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
						<button class="list-remove-button" on:click={() => handleRemoveCar(item)}>&times;</button>
					</div>
				{/each}
			</div>
		</div>
	
		<div class="cars-content">	
			<div id="cars_details">
				<h1>Detail vozidla</h1>
				{#if focusedItem && outroEnd }
					{#key focusedItem }
					<img in:fly="{{x: 200, duration: 250}}" out:fly="{{y: 200, duration: 250}}"
						on:outroend={() => outroEnd = true}
						on:outrostart={() => outroEnd = false}
						src={focusedItem.avatar ? focusedItem.avatar : '/car_placeholder.png'}
						alt="The selected car"
					/>
					{/key}
					<p>{`${focusedItem.brand} ${focusedItem.model} ${focusedItem.year}`}</p>
					<button on:click={() => handleRemoveCar(focusedItem)}>Smazat</button>
				{/if}
			</div>
		</div>
	</div>
	<div class="cars_form-submit">
		<button on:click={handleSubmit}>Vložit</button>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

	.cars_list-item {
		padding: 1px 5px;
	}

	.cars_list-item:hover {
		background-color: rgba(0, 85, 10, 0.1);
		cursor: pointer;
	}

	.cars_list-item:focus {
		background-color: rgba(0, 85, 10, 0.3);
	}

	.cars_list-item:focus, .cars_list-item:hover {
		border: 1px solid #52796f;
		border-radius: 5px;
		padding: 0 4px;
	}

	main, button {
		color: white;
		font-family: 'Nunito';
	}
	
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #1A1B2A;
	}

	.content-box {
		display: flex;
		justify-content: center;
		max-width: 1000px;
		width: 100%;
		max-height: 600px;
		height: 100%;
		border-radius: 15px;
	}

	.cars_form-submit {
		margin-top: 20px;
	}

	.content-box, .cars_form-submit button {
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
		background: rgb(0,44,75);
		background: linear-gradient(90deg, rgba(0,44,75,1) 0%, #00550a80 100%);
	}

	.cars_form-submit button {
		padding: 15px 32px;
		border-radius: 50px;
		border: none;
		font-family: 'Nunito';
		color: white;
	}

	.cars_form-submit button:hover {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6);
	}

	.cars_form-submit button:hover {
		cursor: pointer;
	}


	#cars_form {
		display: flex;
		flex-direction: column;
	}

	.file-input-text {
		color: rgb(0, 165, 10);
		text-decoration: underline;
	}

	.file-input-text:hover {
		cursor: pointer;
	}

	.cars_form-inputs {
		display: flex;
		align-items: stretch;
		flex-direction: column;
		margin: 10px;
		gap: 10px;
	}

	.cars_form-inputs div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.cars-content {
		display: flex;
		flex-grow: 1;
	}

	#cars_list::-webkit-scrollbar {
		width: 10px;
	}

	#cars_list::-webkit-scrollbar-track {
		background-color: #FFFFFF;
		border-radius: 5px;
	}

	#cars_list::-webkit-scrollbar-thumb {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6);
		border-radius: 5px;
	}

	#cars_list {
		display: flex;
		flex-direction: column;
		padding: 10px;
		margin-bottom: 5px;
		gap: 10px;
		max-width: 400px;
		word-break: break-all;
		overflow-y: auto;
		scrollbar-width: thin;
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
		align-items: center;
		word-break: break-all;
		width: 100%;
		padding: 10px;
		overflow-y: hidden;
		overflow-x: hidden;
	}

	#cars_details img {
		max-width: 100%;
		max-height: 400px;
	}

	#cars_details button {
		align-self: flex-end;
		padding: 8px 24px;
		border-radius: 50px;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
		background: rgb(0,44,75);
		cursor: pointer;
		border: none
	}

	#cars_details button:hover {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6);
	}

	input[type="text"], input[type="number"] {
		background: white;
		border: 2px solid rgba(0, 85, 10, 0.5);
		border-radius: 8px;
		height: 30px;
		padding: 0 8px;
	}

	.list-remove-button {
		overflow: hidden;
		border: none;
		padding: 0;
		border-radius: 50%;
		font-size: 25px;
		background: transparent;
		color: rgb(0, 165, 10);
		cursor: pointer;
	}
</style>
