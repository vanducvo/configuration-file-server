class SingleQuery {
  constructor(path, value){
    this.path = path;
    this.value = value;
  }

  getPath(){
    return this.path;
  }

  setPath(path){
    this.path = path;
  }

  getValue(){
    return this.value;
  }

  setValue(value){
    this.value = value;
  }
}

module.exports = SingleQuery;
