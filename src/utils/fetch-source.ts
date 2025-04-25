import { requestUrl } from 'obsidian'
import Source from '~/model/source'
import SourceMetadata from '~/model/source-metadata'

export default async function (source: Source) {
	const resp = await requestUrl(source.url)
	return resp.json as SourceMetadata[]
}
