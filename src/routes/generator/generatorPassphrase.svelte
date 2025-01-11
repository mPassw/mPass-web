<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { Slider } from '@/components/ui/slider';
	import { Switch } from '@/components/ui/switch';
	import { passwordGeneratorState } from '@/state/passwordGeneratorState.svelte';
</script>

<div class="flex w-full flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Words amount</h2>
			<p class="font-semibold tracking-tight">{passwordGeneratorState.passphraseLength}</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.passphraseLength}
			min={3}
			max={32}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Numbers</h2>
			<p class="font-semibold tracking-tight">{passwordGeneratorState.passphraseNumbersAmount}</p>
		</div>
		<Slider
			type="single"
			bind:value={passwordGeneratorState.passphraseNumbersAmount}
			min={0}
			max={passwordGeneratorState.passphraseLength}
			onValueCommit={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
<div class="flex w-full flex-col items-start gap-4 md:flex-row">
	<div class="flex w-full flex-col items-start gap-2">
		<h2 class="text-lg font-semibold tracking-tight">Word separator</h2>
		<Input
			bind:value={passwordGeneratorState.passphraseSeparator}
			class="bg-white shadow-sm dark:bg-black"
			type="text"
			placeholder="Separator"
			maxlength={3}
			minlength={1}
		/>
	</div>
	<div class="flex w-full flex-col items-start gap-4">
		<div class="flex w-full flex-row items-center justify-between">
			<h2 class="text-lg font-semibold tracking-tight">Capitalization</h2>
		</div>
		<Switch
			bind:checked={passwordGeneratorState.passphraseCapitalization}
			onCheckedChange={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
