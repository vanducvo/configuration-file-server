class Assignment {
  constructor(path, value, isDelete = false){
    this._path = path;
    this._value = value;
    this._delete = isDelete;
  }

  getPath(){
    return this._path;
  }

  setPath(path){
    this._path = path;
  }

  getValue(){
    return this._value;
  }

  setValue(value){
    this._value = value;
  }

  isDelete(){
    return this._delete;
  }

  setDelete(isDelete){
    this._delete = isDelete;
  }
}

module.exports = Assignment;
