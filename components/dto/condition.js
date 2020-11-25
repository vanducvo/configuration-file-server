class SingleQuery {
  constructor(query){
    this._query = query;

  }

  getQuery(){
    return this._query;
  }

  setQuery(query){
    this._query = query;
  }
}

module.exports = SingleQuery;
