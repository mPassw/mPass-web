<script lang="ts">
	import { BlurFade } from '@/animations/blurFade';
	import { OTPInput, OTPRoot } from '@jimmyverburgt/svelte-input-otp';
	import Icon from '@iconify/svelte';
	import { Button } from '@/components/ui/button';
	import { userState } from '@/state/userState.svelte';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let code: string = $state('');

	const resendCode = async () => {
		try {
			isLoading = true;

			const res = await fetch(`${userState.serverUrl}/auth/Email/resend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: userState.email
				})
			});

			if (!res.ok) {
				throw new Error(await res.text());
			}

			toast.success('Code resent');
		} catch (err: any) {
			toast.error(err.message || 'Unknown error');
		} finally {
			isLoading = false;
		}
	};

	const handleOtpComplete = async () => {
		try {
			isLoading = true;

			const res = await fetch(`${userState.serverUrl}/auth/Email/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: userState.email,
					code
				})
			});

			if (!res.ok) {
				throw new Error();
			}

			userState.authState = 'login';

			toast.success('Email verified');
		} catch {
			toast.error('Invalid code');
		} finally {
			isLoading = false;
		}
	};
</script>

<BlurFade delay={0.1} class="flex w-full max-w-[400px] flex-col gap-4">
	<div class="flex w-full flex-col items-center justify-center gap-2">
		<h3 class="text-2xl font-semibold tracking-tight">Email Verification</h3>
		<p class="text-center text-sm text-muted-foreground">
			We have sent a verification code to your email. Please enter the code below
		</p>
	</div>
	<OTPRoot
		disabled={isLoading}
		maxLength={6}
		ariaLabel="Email Verification Code"
		bind:value={code}
		autoFocus={false}
		onComplete={handleOtpComplete}
		className="flex items-center gap-2 w-full justify-center"
	>
		{#snippet children({ fields })}
			<div class="flex items-center">
				{#each fields.slice(0, 3) as field}
					<OTPInput
						{field}
						className="relative flex w-8 h-10 bg-white dark:bg-black items-center justify-center border-y border-r border-input text-lg transition-all first:rounded-l-md first:border-l last:rounded-r-md"
						focusClassName="z-10 ring-2 ring-ring ring-offset-background"
					/>
				{/each}
			</div>
			<div class="mx-1">
				<Icon icon="lucide:minus" />
			</div>
			<div class="flex items-center">
				{#each fields.slice(3, 6) as field}
					<OTPInput
						{field}
						className="relative flex w-8 h-10 bg-white dark:bg-black items-center justify-center border-y border-r border-input text-lg transition-all first:rounded-l-md first:border-l last:rounded-r-md"
						focusClassName="z-10 ring-2 ring-ring ring-offset-background"
					/>
				{/each}
			</div>
		{/snippet}
	</OTPRoot>
	<Button
		variant="link"
		class="self-center text-muted-foreground"
		disabled={isLoading}
		onclick={resendCode}
	>
		Resend Code
	</Button>
</BlurFade>
