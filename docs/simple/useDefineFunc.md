# useDefineFunc

让参数晚一点进来

## Usage

### 定义
```ts
function useXXX(option?: { afterClose?: () => void }) {
	const { func: afterClose, defineFunc: defineAfterClose } = useDefineFunc(option?.afterClose)

	// xxx
	const close = () => {
		// xxx
		afterClose()
	}

	return {
		defineAfterClose,
	}
}

```

### 使用
```ts
const { defineAfterClose } = useXXX()

defineAfterClose(() => {
	//xxx
})


```
