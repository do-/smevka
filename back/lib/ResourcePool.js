class ResourcePool {
	
	async toSet (job, name) {
	
		const raw = await this.acquire ()

		const resource = new this.wrapper (raw)

		job [name] = resource

		job.on ('finish', () => resource.release ())

	}

}

module.exports = ResourcePool