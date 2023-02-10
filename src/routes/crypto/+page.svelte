<script lang="ts">
	let message = '';
	let ivcipher = '';
	let plain_text = '';

	async function encrypt() {
		const response = await fetch('/api/encrypt', {
			method: 'POST',
			body: JSON.stringify(message)
		});
		ivcipher = await response.json();
	}

	async function decrypt() {
		const response = await fetch('/api/decrypt', {
			method: 'POST',
			body: JSON.stringify(ivcipher)
		});
		plain_text = await response.json();
	}
</script>

<div class="pad col">
	<label for="message">Message: <input type="text" bind:value={message} name="message" /></label>
	<button on:click={encrypt}>Encrypt</button>
	<div>Encrypted: {ivcipher}</div>
	<button on:click={decrypt}>Decrypt</button>
	<div>Decrypted: {plain_text}</div>
</div>

<style>
	.pad {
		padding: 20px;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
	}
</style>
