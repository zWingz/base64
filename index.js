/**
所谓Base64，就是说选出64个可打印字符—-小写字母a-z、大写字母A-Z、数字0-9、符号”+”、”/”（再加上作为补全字的”=”，实际上是65个字符），
作为一个基本字符集。然后，其他所有符号都转换成这个字符集中的字符。

1.将每三个字节作为一组，一共是24个二进制位。

2.将这24个二进制位分为四组，每个组有6个二进制位。

a）二个字节的情况：将这二个字节的一共16个二进制位，按照上面的规则，转成三组，最后一组除了前面加两个0以外，后面也要加两个0。这样得到一个三位的Base64编码，再在末尾补上一个”=”号。

b）一个字节的情况：将这一个字节的8个二进制位，按照上面的规则转成二组，最后一组除了前面加二个0以外，后面再加4个0。这样得到一个二位的Base64编码，再在末尾补上两个”=”号。

3.在每组前面加两个00，扩展成32个二进制位，即四个字节。

a) 如剩余字节为一位, 则补2个'='
b) 如剩余字节为两位, 则补1个'='

4.根据每一项二进制算出十进制, 并找出对应的char

*/

const b64chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function splitByCount(str, count) {
  const len = str.length
  const arr = []
  let index = 0
  while (index < len) {
    arr.push(str.substr(index, count))
    index += count
  }
  return arr
}

function pad(str, count) {
  return str.padStart(count, '0')
}

function encode(str) {
  const codeArr = []
  // 第一步, 每三个字节分一组
  const str3byteArr = splitByCount(str, 3)
  // 通过charCodeAt获取字符编码, 并且通过toString转成二进制
  // 如果不为8位, 则补0
  // 此时每项有24个二进制位
  str3byteArr.forEach(each => {
    let str = ''
    for (let i = 0; i < each.length; i++) {
      const c = each.charCodeAt(i).toString(2)
      str += c.length === 8 ? c : pad(c, 8)
    }
    codeArr.push(str)
  })
  // 第二步, 将24个二进制位分成4组, 每组6个二进制位
  let bit8code = codeArr.map(each => splitByCount(each, 6))
  // 不足3字节的, 则最后一项必定不满6位二进制, 此时只要往后补0, 补够6位二进制
  // 只有一字节的, 最后一项只有两位二进制, 则补4个0
  // 只有两字节的, 最后一项只有4位二进制, 则补2个领
  bit8code = bit8code.map(each => {
    const len = each.length
    const code = each[len - 1]
    if (len !== 4) {
      // 通过padEnd方法, 补0
      each[len - 1] = code.padEnd(6, '0')
    }
    return each
  })
  // 此时bit8code为二维数组, 每一组有4个item
  // 第三步, 将每组的6个二进制位前面补8, 可以省略
  // bit8code = bit8code.map(each => each.map(e => pad(e, 8)))
  // 第四步, 将base64char对应上
  // console.log(bit8code)
  const result = bit8code
    .map(each => {
      // 将每一组的一位数组的每一项转成10进制
      const strArr = each.map(bit => {
        const idx = parseInt(bit, 2)
        return b64chars[idx]
      })
      // 用=号来补上前面不足3字节的坑
      // 既每一项都要凑够4个string
      return strArr.join('').padEnd(4, '=')
    })
    .join('')
  return result
}

function decode(str) {
  const str4byteArr = splitByCount(str, 4)
  let bit8code = []
  str4byteArr.forEach(each => {
    const code = []
    const len = each.length
    for (let i = 0; i < len; i++) {
      const char = each[i]
      if (char === '=') {
        const last = code.length - 1
        code[last] = code[last].slice(0, (i - 4) * 2)
        break
      }
      const c = b64chars.indexOf(char).toString(2)
      code.push(pad(c, 6))
    }
    bit8code.push(code)
  })
  const charArr = bit8code
    .reduce((s, c) => {
      return s.concat(splitByCount(c.join(''), 8))
    }, [])
    .map(each => String.fromCharCode(parseInt(each, 2)))
  const result = charArr.join('')
  return result
}

// const str = encode('MVNU1hnI048')
// console.log(str)
// decode(str)
// console.log(decode(str) === 'MVNU1hnI048');

module.exports = {
  encode,
  decode
}
