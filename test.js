
const { encode, decode } = require('./index')
const mock = require('mockjs')

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return Buffer.from(str).toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString();
  };
}



describe('test', () => {
  it('test ecode and decode', () => {
    for(let i = 0; i < 1000; i ++) {
      const str = mock.Random.string(1, 20)
      // console.log(str);
      const rec = decode(encode(str))
      expect(rec).toEqual(atob(btoa(str)))
      expect(rec).toEqual(str)
    }
  })
})
