if (global) {
  (global as any).System = {
    import() {
      return Promise.resolve();
    }
  };
}
