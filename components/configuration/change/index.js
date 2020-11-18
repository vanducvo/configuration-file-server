class Change {
  constructor(path, value, isDelete = false){
    this.path = path;
    this.value = value;
    this.delete = isDelete;
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

  isDelete(){
    return this.delete;
  }

  setDelete(isDelete){
    this.delete = isDelete;
  }
}

module.exports = Change;
