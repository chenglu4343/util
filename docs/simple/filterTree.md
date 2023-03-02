# filterTree
用来过滤树

## 使用
```ts
const tree = [
  {
    label: '0',
    children: [
      {
        label: '0-1',
        children: [],
      },
    ],
  },
  {
    label: '1',
    children: [],
  },
]

filterTree(tree, option)
```

### 隐藏指定level的树节点

``` ts
const newTree = filterTree(tree, {
  hideLevels: [0],
  /** 将隐藏的level添加后的行为，默认为append
   * append：隐藏的level后续的children节点添加到父节点上
   * hide：跟随隐藏的level进行隐藏
   */
  hideAction: 'append'
})
```

### 添加一些额外的属性

``` ts
const newTree = filterTree(tree, {
  setNewTreeItem(treeItem, { level, father }) {
    const fatherKey = father?.key
    const prefix = fatherKey ? (`${fatherKey}-`) : ''
    treeItem.key = prefix + level
    return treeItem
  },
})
```

## options
```ts
interface Option<T> {
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

  /** 对于children为空数组时，是否替换为undefined，默认不替换 */
  replaceUndef: boolean

  /** 顶层树的节点，默认为0 */
  topLevel?: number
}

interface CustomOption<T> {
  father: T | null
  level: number
}
```
