class Resources {
	value: '' | 'docker-compose' | 'docker' | 'from-source' | 'links' = $state('docker-compose');
}

const resourcesState = new Resources();

export { resourcesState };
