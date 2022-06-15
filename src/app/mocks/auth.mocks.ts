export const user = { email: 'test1@test.com', password: '123456' };
export const loginSuccessResponse = {
  ok: true,
  uid: '62a695a2fb343b65403cc226',
  name: 'Test 1',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmE2OTVhMmZiMzQzYjY1NDAzY2MyMjYiLCJuYW1lIjoiVGVzdCAxIiwiaWF0IjoxNjU1MjQ5NTEwLCJleHAiOjE2NTUzMzU5MTB9.suG9smE2yRB4kkOlyDDrflLmOx8YjdLXN2bPWViD1ug',
  email: 'test1@test.com',
};
export const loginErrorResponse = {
  ok: false,
  msg: 'Message can change but always is a string with a value',
};
export const registerErrorResponse = {
  ok: false,
  errors: {
    name: {
      msg: 'El nombre es obligatorio',
      param: 'name',
      location: 'body',
    },
  },
};
