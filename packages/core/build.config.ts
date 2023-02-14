import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  outDir: './dist',
  entries: [
    './index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
