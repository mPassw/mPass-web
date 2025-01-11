<script lang="ts">
	import { Slider } from '@/components/ui/slider';
	import { passwordGeneratorState } from '@/state/passwordGeneratorState.svelte';
</script>

<div class="flex w-full flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Password length</h2>
			<p class="font-semibold tracking-tight">{passwordGeneratorState.passwordLength}</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.passwordLength}
			min={4}
			max={64}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Numbers</h2>
			<p class="font-semibold tracking-tight">{passwordGeneratorState.passwordNumbersAmount}</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.passwordNumbersAmount}
			min={0}
			max={passwordGeneratorState.passwordLength -
				(passwordGeneratorState.passwordSpecialAmount + 2)}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
<div class="flex w-full items-start gap-4 md:max-w-[50%] md:pr-2">
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Special characters</h2>
			<p class="font-semibold tracking-tight">{passwordGeneratorState.passwordSpecialAmount}</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.passwordSpecialAmount}
			min={0}
			max={passwordGeneratorState.passwordLength -
				(passwordGeneratorState.passwordNumbersAmount + 2)}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
