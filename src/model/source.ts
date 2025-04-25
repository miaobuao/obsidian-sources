import SourceMetadata from './source-metadata'

export default interface Source {
	url: string
	lastUpdated?: number
	metadata?: SourceMetadata[]
}
