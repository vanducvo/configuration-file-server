const StrategyStore = require('./strategy-store');

describe('Strategy Store', () => {
  it('should throw error if select not yet implements', async () => {
    const store = new StrategyStore();
    await expect(
      store.select()
    ).rejects.toThrowError(`Method ${store.select.name} Not Implmentent!`);
  });

  it('should throw error if insert not yet implements', async () => {
    const store = new StrategyStore();
    await expect(
      store.insert()
    ).rejects.toThrowError(`Method ${store.insert.name} Not Implmentent!`);
  });

  it('should throw error if delete not yet implements', async () => {
    const store = new StrategyStore();
    await expect(
      store.delete()
    ).rejects.toThrowError(`Method ${store.delete.name} Not Implmentent!`);
  });

  it('should throw error if update not yet implements', async () => {
    const store = new StrategyStore();
    await expect(
      store.update()
    ).rejects.toThrowError(`Method ${store.update.name} Not Implmentent!`);
  });
});
