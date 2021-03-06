const b_encoding = '0123456789!#$%&()*+,-./;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
const b_len = b_encoding.length

function i2s_s(value, length) {
    if (typeof length === 'undefined') { 
        length = 0 
    }
    
    if (value < 0) {
        return i2s(-value * 2, length)
    }
    else {
        return i2s(value * 2 + 1, length)
    }
}

function i2s(i, length) {
    if (typeof length === 'undefined') { length = 0 }
    
    var s = ''

    while (i > 0 || length > s.length) {
        s = b_encoding.charAt(i % b_len) + s 
        i = ~~(i / b_len)
    }
    
    return s
}

function s2i(s) {
    var i = 0

    while (s.length) {
        i = i * b_len + b_encoding.indexOf(s.charAt(0))
        s = s.substr(1, s.length - 1)
    }

    return i
}
