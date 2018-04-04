const kWhite        = 0xffffffff
const kSilver       = 0xffbbbbbb
const kBlack        = 0xff000000
const kGrey         = 0xff808080
const kDarkGrey     = 0xff404040
const kDarkestGrey  = 0xff202020
const kProcess1     = 0xfff06020
const kProcess2     = 0xff6e28fa
const kProcessLow1  = 0xffa04020
const kProcessLow2  = 0xff3e18ba
const kProcess1Text = 0xffffc080
const kProcess2Text = 0xffddddff

var ctx = null
var offs_x = 0
var offs_y = 0
var image_data = null
var width = 0
var height = 0

var buf
var buf8
var buf32

function draw_set_context(canvas, scale) {
    ctx = canvas.getContext('2d')
    width = row_height * ~~(canvas.width / scale / row_height)
    height = row_height * ~~(canvas.height / scale / row_height)
    
    image_data = ctx.getImageData(0, 0, width, height)

    buf = new ArrayBuffer(image_data.data.length)
    buf8 = new Uint8ClampedArray(buf)
    buf32 = new Uint32Array(buf)
}

function draw_darken(color) {
    return ((color & 0x00fefefe) >>> 1) | 0xff000000
}

function draw_pixel(x, y, color) {
    var idx = ((offs_x + x) + (offs_y + y) * width)

    buf32[idx] = color
}

function draw_flip() {
    image_data.data.set(buf8)
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    ctx.putImageData(image_data, 0, 0)
    
    if (scale !== 1) {
        ctx.imageSmoothingEnabled = ~~scale != scale
        ctx.scale(scale, scale)
        ctx.drawImage(ctx.canvas, 0, 0)
        ctx.scale(1 / scale, 1 / scale)
    }
}

function draw_rect(x, y, w, h, color) {
    for (var dx = x; dx < x + w; dx++) {
        for (var dy = y; dy < y + h; dy++) {
            draw_pixel(dx, dy, color)
        }
    }
}

function draw_triangles(x, y, w, h, color1, color2) {
    for (dx = 0; dx < w; dx++) {
        for (dy = 0; dy < h; dy++) {
            draw_pixel(x + dx, y + dy, dy < dx ? color2 : color1)
        }
    }
}

function draw_translate_to(x, y) {
    offs_x = x
    offs_y = y
}