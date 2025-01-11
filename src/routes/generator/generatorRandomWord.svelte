<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { Slider } from '@/components/ui/slider';
	import { Switch } from '@/components/ui/switch';
	import { passwordGeneratorState } from '@/state/passwordGeneratorState.svelte';
</script>

<div class="flex w-full flex-col items-start gap-4">
	<div class="flex w-full flex-row items-center gap-2">
		<h2 class="text-lg font-semibold tracking-tight">Capitalize</h2>
		<Switch
			bind:checked={passwordGeneratorState.usernameRandomWordCapitalization}
			onCheckedChange={() => passwordGeneratorState.generate()}
		/>
	</div>
	<div class="flex w-full flex-row items-center gap-2">
		<h2 class="text-lg font-semibold tracking-tight">Include numbers</h2>
		<Switch
			bind:checked={passwordGeneratorState.usernameRandomWordIncludeNumber}
			onCheckedChange={() => passwordGeneratorState.generate()}
		/>
	</div>
</div>
