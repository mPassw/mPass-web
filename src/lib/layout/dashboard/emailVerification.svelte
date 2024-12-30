<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { BlurFade } from '@/components/animations/blurFade';
	import { currentAuthState, email, instanceUrl } from '@/shared';
	import { verifyEmail } from '@/auth';
	import { toast } from 'svelte-sonner';

	let isLoading: boolean = $state(false);

	let code: string = $state('');

	const handleVerifyEmail = async () => {
		try {
			isLoading = true;

			const res = await verifyEmail($email, code, $instanceUrl);

			if (res) {
				toast.success('Email verified successfully');
				$currentAuthState = 'login';

				code = '';
			} else {
				toast.error('Invalid code');
			}
		} catch {
			toast.error('Unknown error. Please try again');
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
	<div class="flex w-full justify-center">
		<InputOTP.Root
			disabled={isLoading}
			maxlength={6}
			bind:value={code}
			pattern={REGEXP_ONLY_DIGITS}
			onComplete={async () => await handleVerifyEmail()}
		>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell}
						<InputOTP.Slot class="bg-white shadow-sm dark:bg-black" {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell}
						<InputOTP.Slot class="bg-white shadow-sm dark:bg-black" {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</div>
</BlurFade>
