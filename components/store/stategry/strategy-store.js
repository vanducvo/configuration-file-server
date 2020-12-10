class StrategyStore {
  async select(_condition) {
    throw new Error(`Method ${this.select.name} Not Implmentent!`);
  }
  async insert(_configuration) {
    throw new Error(`Method ${this.insert.name} Not Implmentent!`);
  }
  async update(_assignment, _condition) {
    throw new Error(`Method ${this.update.name} Not Implmentent!`);
  }
  async delete(_condition) {
    throw new Error(`Method ${this.delete.name} Not Implmentent!`);
  }
}

module.exports = StrategyStore;
