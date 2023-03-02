# doSomeOne

if else的另一种写法

## Usage
```ts
const isLogin = true
const isHasPermission = false

doSomeOne([
  [
    !isLogin,
    () => {
      // xxx
    }
  ],
  [
    !isHasPermission,
    () => {
      // xxx
    }
  ],
  [
    isLogin && isHasPermission,
    () => {
      // xxx
    }
  ]
])
```
