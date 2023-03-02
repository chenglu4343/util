import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  outDir: './dist',
  entries: ['./src/index'],
  rootDir: '.',
  declaration: true,
  dependencies: ['lodash-es'],
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
