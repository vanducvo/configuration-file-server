const Response = require('./response.js');
describe('Reponse Class', () => {
  const message = 'OK';
  const data = {id: 0};

  it('should have constructor with no argument', () => {
    const response = new Response();

    expect(response).toBeInstanceOf(Response);
  });

  it('should have constructor with code, message, data argument', () => {
    const response = new Response(message, data);

    expect(response).toBeInstanceOf(Response);
  });

  it('should have get data', () => {
    const response = new Response(message, data);

    expect(response.getData()).toEqual(data);
  });
  
  it('should have constructor with deep copy data', () => {
    const dynamicData = {...data};
    const response = new Response(message, data);

    dynamicData.id = 2;

    expect(response.getData()).not.toEqual(dynamicData);
  });

  it('should have set message', () => {
    const response = new Response(message, data);

    const newMessage = message + "new";
    response.setMessage(newMessage);

    expect(response.getMessage()).toEqual(newMessage);
  });

  it('should have a set data', () => {
    const response = new Response();

    response.setData(data);

    expect(response.getData()).toEqual(data);
  });

  it('should have a set with deep copy', () => {
    const response = new Response();

    const newData = JSON.parse(JSON.stringify(data));
    response.setData(newData);
    newData.id = 1;

    expect(response.getData()).not.toEqual(newData);
  });
});
