import { isNil } from 'lodash-es'

interface CommonOption<T> {
	/** 指向children的key值，默认为children */
	children: string

	/** 需要隐藏的levels */
	hideLevels: number[]
	/** 将隐藏的level添加后的行为，默认为append
	 * append：隐藏的level后续的children节点添加到父节点上
	 * hide：跟随隐藏的level进行隐藏
	 */
	hideAction: 'append' | 'hide'
	/** 自定义hide方法，如果返回为true则hide */
	customHide: (treeItem: T, option: CustomOption<T>) => boolean

	/** 可以添加一些除了children的额外的属性 */
	setNewTreeItem: (treeItem: T, option: CustomOption<T>) => T
}

interface Options<T> extends Partial<CommonOption<T>> {
	/** 默认为0 */
	topLevel?: number
}

interface FilterTreeItemOptions<T> extends CommonOption<T> {
	currentLevel: number
	father: T | null
}

interface CustomOption<T> {
	father: T | null
	level: number
}

export function filterTree<T>(tree: T[], options?: Options<T>) {
	const {
		children = 'children',
		topLevel = 0,
		hideLevels = [],
		hideAction = 'append',
		customHide = () => false,
		setNewTreeItem = (treeItem: T) => treeItem,
	} = options || {}

	return tree
		.map((treeItem) =>
			filterTreeItem(treeItem, {
				currentLevel: topLevel,
				hideLevels,
				children,
				hideAction,
				father: null,
				customHide,
				setNewTreeItem,
			})
		)
		.flat()
}

/** 循环过滤掉一个treeItem
 * 需要被剪掉时返回[]
 * 需要被展开时返回待展开的数组
 * 其他情况返回一个新的 treeItem
 *  */
function filterTreeItem<T>(treeItem: T, options: FilterTreeItemOptions<T>): T[] | T {
	const { currentLevel, hideLevels, children, hideAction, customHide, setNewTreeItem, father } = options

	if (isNil(treeItem)) {
		return []
	}

	const customOption: CustomOption<T> = {
		father,
		level: currentLevel,
	}

	if (hideLevels.includes(currentLevel) || customHide(treeItem, customOption)) {
		return hideAction === 'append' ? getFilterChildren() : []
	}

	function getFilterChildren() {
		return (treeItem[children] || [])
			.map((childItem: any) =>
				filterTreeItem(childItem, {
					...options,
					father: treeItem,
					currentLevel: currentLevel + 1,
				})
			)
			.flat()
	}

	return {
		...setNewTreeItem(treeItem, customOption),
		[children]: getFilterChildren(),
	}
}
