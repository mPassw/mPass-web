<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { Slider } from '@/components/ui/slider';
	import { passwordGeneratorState } from '@/state/passwordGeneratorState.svelte';
</script>

<div class="flex w-full flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Email</h2>
		</div>
		<Input
			bind:value={passwordGeneratorState.usernameAddressedEmail}
			type="text"
			placeholder="mail@example.com"
			class="bg-white shadow-sm dark:bg-black"
			oninput={() => passwordGeneratorState.generate()}
		/>
	</div>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Length</h2>
			<p class="font-semibold tracking-tight">
				{passwordGeneratorState.usernameAddressedEmailLength}
			</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.usernameAddressedEmailLength}
			min={4}
			max={12}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
