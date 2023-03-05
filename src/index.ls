<-(->it!) _
typemap = do
  mime: do
    bmp: \image/bmp
    gif: \image/gif
    png: \image/png
    svg: \image/svg+xml
    tif: \image/tiff
    jpg: \image/jpeg

  base64: do
    "Qk": \bmp, "/9": \jpg, "iV": \png, "R0": \gif,
    "SU": \tif, "TU": \tif
    "ID": \svg, "PD": \svg, "PH": \svg, "IC": \svg
  byte: do
    16973: \bmp, 65496: \jpg, 35152: \png, 18249: \gif
    18761: \tif, 19789: \tif
    15423: \svg, 15475: \svg, 8252: \svg, 8224: \svg

imgtype = (d) -> new Promise (res, rej) ->
  if File? and (d instanceof File) =>
    d.arrayBuffer!then (ab) -> res imgtype(new Uint8Array(ab))
  else =>
    ret = if typeof(d) == \string => typemap.base64[d.substring(0,2)]
    else if Buffer? and (d instanceof Buffer) => typemap.byte[d.0 * 0x100 + d.1]
    else if d and d.length => typemap.byte[d.0 * 0x100 + d.1]
    else null
    res if ret => {ext: ret, mime: typemap.mime[ret]} else {ext: null}

if window? => window.imgtype = imgtype
else if module? => module.exports = imgtype
