const v8 = require('v8');
const { measureMemory } = require('vm');

class Response {
  constructor(message, data){
    this._message = message;
    this._data = Response.deepClone(data);
  }
  
  static deepClone(data){
    return v8.deserialize(v8.serialize(data))
  }

  getMessage(){
    return this._message;
  }

  getData(){
    return Response.deepClone(this._data);
  }

  setMessage(message){
    this._message = message;
  }

  setData(data){
    this._data = Response.deepClone(data);
  }
}

module.exports = Response;
