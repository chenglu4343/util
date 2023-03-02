import { describe, expect, it } from 'vitest'
import { isEqual } from 'lodash-es'
import { filterTree } from './filterTree'

const createTree = () => [
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

describe('test filterTree', () => {
  it('no options noChange', () => {
    const tree = createTree()
    const newTree = filterTree(tree)
    expect(isEqual(newTree, tree)).toBe(true)
  })

  it('隐藏level 0，后续显示', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      hideLevels: [0],
    })

    expect(
      isEqual(newTree, [
        {
          label: '0-1',
          children: [],
        },
      ]),
    ).toBe(true)
  })

  it('隐藏level 0，后续显示，children为undefined', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      hideLevels: [0],
      replaceUndef: true,
    })

    expect(
      isEqual(newTree, [
        {
          label: '0-1',
          children: undefined,
        },
      ]),
    ).toBe(true)
  })

  it('隐藏level 0，但是隐藏后续显示', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      hideLevels: [0],
      hideAction: 'hide',
    })

    expect(isEqual(newTree, [])).toBe(true)
  })

  it('隐藏level 0 ,1 ，全部消失', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      hideLevels: [0, 1],
    })

    expect(isEqual(newTree, [])).toBe(true)
  })

  it('通过customHide ，全部消失', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      customHide: () => true,
    })

    expect(isEqual(newTree, [])).toBe(true)
  })

  it('添加新属性', () => {
    const tree = createTree()
    const newTree = filterTree(tree, {
      hideLevels: [0],
      setNewTreeItem(treeItem) {
        return {
          ...treeItem,
          isActive: true,
          children: [
            {
              label: '无效属性',
              children: [],
            },
          ],
        }
      },
    })

    expect(
      isEqual(newTree, [
        {
          label: '0-1',
          isActive: true,
          children: [],
        },
      ]),
    ).toBe(true)
  })
})
