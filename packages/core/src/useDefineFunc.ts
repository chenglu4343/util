export function useDefineFunc<T extends (...args: any) => any>(initialFunc?: T) {
  let innerFunc = initialFunc || null;

  return {
    func: (...args: Parameters<T>) => innerFunc?.(...(args as any)) as ReturnType<T> | undefined,
    defineFunc: (newFunc: typeof innerFunc) => {
      innerFunc = newFunc;
    },
  };
}
