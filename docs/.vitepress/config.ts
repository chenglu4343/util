import { DefaultTheme, defineConfig } from 'vitepress'
import path from 'node:path'
import fg from 'fast-glob'

export default defineConfig({
	title: 'util文档',
	description: 'Just simple util',
	cleanUrls: true,
	themeConfig: {
		sidebar: [
			{
				text: 'simple',
				items: getItems('../simple'),
			},
		],
	},
})

function getItems(relativePath: string): DefaultTheme.SidebarItem[] {
	const filesDir = path.resolve(__dirname, relativePath).replaceAll('\\', '/')
	const upFileDir = path.resolve(__dirname, '../').replaceAll('\\', '/')
	const basicRoute = filesDir.split(upFileDir)[1]
	console.log('basicRoute', basicRoute)

	const mdList = fg
		.sync(`${filesDir}/**/*.md`)
		.map((filePath) => filePath.split('/').at(-1).split('.')[0])
		.sort((first, second) => {
			return first > second ? 1 : -1
		})

	return mdList.map((md) => ({
		text: md,
		link: basicRoute + '/' + md,
	}))
}
