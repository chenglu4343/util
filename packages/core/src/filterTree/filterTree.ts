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

  /** 可以添加一些额外的属性 */
  setNewTreeItem: (treeItem: T, option: CustomOption<T>) => T

  /** 设置新属性的时机，before可以拿到较新的father值，after可以拿到较新的children值，默认为after */
  setTreeItemTrigger: 'before' | 'after'

  /** 对于children为空数组时，是否替换为undefined，默认不替换 */
  replaceUndef: boolean
}

interface Options<T> extends Partial<CommonOption<T>> {
  /** 顶层树的节点，默认为0 */
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
    replaceUndef = false,
    customHide = () => false,
    setNewTreeItem = (treeItem: T) => treeItem,
    setTreeItemTrigger = 'after',
  } = options || {}

  return tree
    .map(treeItem =>
      filterTreeItem(treeItem, {
        currentLevel: topLevel,
        hideLevels,
        children,
        hideAction,
        father: null,
        replaceUndef,
        customHide,
        setNewTreeItem,
        setTreeItemTrigger,
      }),
    )
    .flat()
}

/** 循环过滤掉一个treeItem
 * 需要被剪掉时返回[]
 * 需要被展开时返回待展开的数组
 * 其他情况返回一个新的 treeItem
 *  */
function filterTreeItem<T>(treeItem: T, options: FilterTreeItemOptions<T>): T[] | T {
  const { currentLevel, hideLevels, children, hideAction, father, replaceUndef, setTreeItemTrigger, customHide, setNewTreeItem } = options

  if (isNil(treeItem))
    return []

  const customOption: CustomOption<T> = {
    father,
    level: currentLevel,
  }

  if (hideLevels.includes(currentLevel) || customHide(treeItem, customOption))
    return hideAction === 'append' ? getFilterChildren(father) : []

  /** 处理children的遍历 */
  function getFilterChildren(newFather?: any) {
    return (treeItem[children] || [])
      .map((childItem: any) =>
        filterTreeItem(childItem, {
          ...options,
          father: newFather || treeItem,
          currentLevel: currentLevel + 1,
        }),
      )
      .flat()
  }

  if (setTreeItemTrigger === 'before') {
    const newItem = setNewTreeItem(treeItem, customOption)
    const newChildren = getFilterChildren(newItem) as T[]

    return {
      ...newItem,
      [children]: (newChildren.length === 0 && replaceUndef) ? undefined : newChildren,
    }
  }
  else {
    const newChildren = getFilterChildren() as T[]

    return setNewTreeItem({
      ...treeItem,
      [children]: (newChildren.length === 0 && replaceUndef) ? undefined : newChildren,
    }, customOption)
  }
}
