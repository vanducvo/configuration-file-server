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

  apply(context){
    const steps = this.getSteps();

    let variable = context;
    for(let i = 0; i < steps.length - 1; i++){
      variable = variable[steps[i]];
      if(Assignment.isJSON(variable)){
        throw new Error('Path invalid!');
      }
    }

    const lastProperty = steps[steps.length - 1];
    if(this._delete){
      delete variable[lastProperty];
    } else {
      variable[lastProperty] = this._value;
    }
    
    return context;
  }

  getSteps() {
    return this._path.split('.');
  }

  static isJSON(variable) {
    return !variable || typeof (variable) !== 'object';
  }
}

module.exports = Assignment;
