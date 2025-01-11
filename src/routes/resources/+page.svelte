<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { BlurFade } from '@/animations/blurFade';
	import { resourcesState } from '@/state/resourcesState.svelte';
	import { CodeBlock } from '@/components/ui/code-block';
	import Icon from '@iconify/svelte';
</script>

<BlurFade delay={0.1} once class="mt-14 flex w-full justify-center gap-2 p-4">
	<div class="flex w-full max-w-[1000px] rounded-md border bg-white px-4 dark:bg-black">
		<Accordion.Root type="single" class="w-full" bind:value={resourcesState.value}>
			<Accordion.Item value="docker-compose">
				<Accordion.Trigger>Self-Host with Docker Compose</Accordion.Trigger>
				<Accordion.Content>
					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-1">
							<h2 class="text-xl font-semibold">Prerequisites</h2>
							<p>Before you begin, ensure you have the following installed on your system:</p>
							<p class="font-medium">- Docker</p>
							<p class="font-medium">- Docker Compose</p>
						</div>
						<div class="flex flex-col gap-2">
							<h2 class="text-xl font-semibold">Installation</h2>
							<p>1. Create mPass directory</p>
							<CodeBlock language={'bash'} code={'mkdir mPass\ncd mPass'} />
							<p>
								2. Create a <span class="rounded bg-muted p-0.5">docker-compose.yml</span> file, and
								paste content from
								<a
									class="border-b border-accent-foreground"
									href="https://github.com/mPassw/mPass-server/blob/main/docker-compose.yml"
									target="_blank">this example</a
								>
							</p>
							<p>
								3. Create a <span class="rounded bg-muted p-0.5">.env</span> file, and set your own
								values for the following variables
								<a
									class="border-b border-accent-foreground"
									href="https://github.com/mPassw/mPass-server/blob/main/.env.example"
									target="_blank">(example)</a
								>:
								<CodeBlock
									language={'plaintext'}
									code={`SERVER_ENCRYPTION_KEY= # 32 characters
SERVER_USE_SWAGGER= # true or false
AUTH_SECURITY_KEY= # 64 characters
AUTH_ISSUER=
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_SENDER=
SMTP_PASSWORD=
SMTP_ENABLE_SSL= # true or false
POSTGRES_PASSWORD=
REDIS_PASSWORD=`}
								/>
							</p>
							<p>
								4. Run the following command to start the server:
								<CodeBlock language={'bash'} code={'docker-compose up -d'} />
							</p>
							<p>
								5. Open your browser and navigate to <span class="rounded bg-muted p-0.5"
									>https://your-domain/api-reference/v1</span
								>. If you see the Swagger UI, then the server is running. If
								<span class="rounded bg-muted p-0.5">SERVER_USE_SWAGGER</span>
								is set to <span class="rounded bg-muted p-0.5">false</span>, you can check your
								server
								<a class="border-b border-accent-foreground" href="/dashboard" target="_blank"
									>here</a
								>
							</p>
							<div class="flex w-full flex-row items-center gap-2 rounded-md bg-muted p-4">
								<Icon icon="lucide:info" font-size="24" class="w-1/12 lg:w-auto" />
								<p class="w-11/12 text-[16px] tracking-tight">
									It is highly recommended to serve mPass over HTTPS. You can use a reverse proxy
									like Nginx or Traefik to achieve this.
								</p>
							</div>
						</div>
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="docker">
				<Accordion.Trigger>Self-Host with Docker</Accordion.Trigger>
				<Accordion.Content>Under construction</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="from-source">
				<Accordion.Trigger>Build from source</Accordion.Trigger>
				<Accordion.Content>Under construction</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="links" class="border-none">
				<Accordion.Trigger>Links</Accordion.Trigger>
				<Accordion.Content>Under construction</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</BlurFade>
