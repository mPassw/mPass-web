<script lang="ts">
	import PasswordsHistory from './passwordsHistory.svelte';
	import GeneratorPassword from './generatorPassword.svelte';
	import GeneratorPassphrase from './generatorPassphrase.svelte';
	import GeneratorAddressedEmail from './generatorAddressedEmail.svelte';
	import GeneratorRandomWord from './generatorRandomWord.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Select from '$lib/components/ui/select/index';
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { CHARSET, NUMBERSET, SPECIALSET } from '@/passwords/generator.svelte';
	import { onMount } from 'svelte';
	import { passwordGeneratorState } from '$lib/state/passwordGeneratorState.svelte';
	import { toast } from 'svelte-sonner';

	$effect(() => {
		if (!passwordGeneratorState.passwordType) {
			passwordGeneratorState.passwordType = 'password';
		}

		if (!passwordGeneratorState.usernameType) {
			passwordGeneratorState.usernameType = 'addressedEmail';
		}
	});

	onMount(() => {
		passwordGeneratorState.generate();
	});
</script>

<BlurFade delay={0.1} once class="mt-14 flex w-full flex-col items-center gap-4 p-4">
	<div class="flex w-full max-w-[1000px] flex-col gap-4">
		<button
			onclick={async () => {
				await navigator.clipboard.writeText(passwordGeneratorState.generatedPassword);
				toast.success('Copied to clipboard');
			}}
			class="flex h-fit w-full flex-wrap items-center justify-center break-all
        rounded-md border bg-white p-8 font-semibold tracking-tight shadow-sm duration-200
        hover:cursor-pointer hover:bg-accent dark:bg-black dark:hover:bg-accent"
		>
			{#each passwordGeneratorState.generatedPassword.split('') as char}
				{#if CHARSET.includes(char)}
					<span>{char}</span>
				{:else if NUMBERSET.includes(char)}
					<span class="text-blue-600">{char}</span>
				{:else if SPECIALSET.includes(char)}
					<span class="text-red-600">{char}</span>
				{:else}
					<span>{char}</span>
				{/if}
			{/each}
		</button>
		<Tabs.Root
			bind:value={passwordGeneratorState.generateType}
			class="w-full"
			onValueChange={() => passwordGeneratorState.generate()}
		>
			<Tabs.List class="flex w-full">
				<Tabs.Trigger value="password" class="w-1/3">Password</Tabs.Trigger>
				<Tabs.Trigger value="username" class="w-1/3">Username</Tabs.Trigger>
				<Tabs.Trigger value="history" class="w-1/3">History</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="password">
				<div class="flex w-full flex-col gap-4">
					<div class="flex flex-col items-start gap-1 md:pr-3">
						<h2 class="text-lg font-semibold tracking-tight">Type</h2>
						<Select.Root type="single" bind:value={passwordGeneratorState.passwordType}>
							<Select.Trigger class="w-full bg-white dark:bg-black md:max-w-[50%]">
								{passwordGeneratorState.passwordType === 'password' ? 'Password' : 'Passphrase'}
							</Select.Trigger>
							<Select.Content onclick={() => passwordGeneratorState.generate()}>
								<Select.Item value="password">Password</Select.Item>
								<Select.Item value="passphrase">Passphrase</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					{#if passwordGeneratorState.passwordType === 'password'}
						<GeneratorPassword />
					{:else}
						<GeneratorPassphrase />
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="username">
				<div class="flex w-full flex-col gap-4">
					<div class="flex flex-col items-start gap-1 md:pr-3">
						<h2 class="text-lg font-semibold tracking-tight">Type</h2>
						<Select.Root type="single" bind:value={passwordGeneratorState.usernameType}>
							<Select.Trigger class="w-full bg-white dark:bg-black md:max-w-[50%]">
								{passwordGeneratorState.usernameType === 'addressedEmail'
									? 'Addressed email'
									: 'Random word'}
							</Select.Trigger>
							<Select.Content onclick={() => passwordGeneratorState.generate()}>
								<Select.Item value="addressedEmail">Addressed email</Select.Item>
								<Select.Item value="randomWord">Random word</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					{#if passwordGeneratorState.usernameType === 'addressedEmail'}
						<GeneratorAddressedEmail />
					{:else}
						<GeneratorRandomWord />
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="history">
				<PasswordsHistory />
			</Tabs.Content>
			{#if passwordGeneratorState.generateType !== 'history'}
				<Button class="mt-6" variant="secondary" onclick={() => passwordGeneratorState.generate()}>
					Regenerate {passwordGeneratorState.generateType === 'password' ? 'password' : 'username'}
				</Button>
			{/if}
		</Tabs.Root>
	</div>
</BlurFade>
