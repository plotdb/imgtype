// Generated by LiveScript 1.6.0
(function(it){
  return it();
})(function(){
  var typemap, imgtype;
  typemap = {
    mime: {
      bmp: 'image/bmp',
      gif: 'image/gif',
      png: 'image/png',
      svg: 'image/svg+xml',
      tif: 'image/tiff',
      jpg: 'image/jpeg'
    },
    base64: {
      "Qk": 'bmp',
      "/9": 'jpg',
      "iV": 'png',
      "R0": 'gif',
      "SU": 'tif',
      "TU": 'tif',
      "ID": 'svg',
      "PD": 'svg',
      "PH": 'svg',
      "IC": 'svg'
    },
    byte: {
      16973: 'bmp',
      65496: 'jpg',
      35152: 'png',
      18249: 'gif',
      18761: 'tif',
      19789: 'tif',
      15423: 'svg',
      15475: 'svg',
      8252: 'svg',
      8224: 'svg'
    }
  };
  imgtype = function(d){
    return new Promise(function(res, rej){
      var ret;
      if ((typeof File != 'undefined' && File !== null) && d instanceof File) {
        return d.arrayBuffer().then(function(ab){
          return res(imgtype(new Uint8Array(ab)));
        });
      } else {
        ret = typeof d === 'string'
          ? typemap.base64[d.substring(0, 2)]
          : (typeof Buffer != 'undefined' && Buffer !== null) && d instanceof Buffer
            ? typemap.byte[d[0] * 0x100 + d[1]]
            : d && d.length ? typemap.byte[d[0] * 0x100 + d[1]] : null;
        return res(ret
          ? {
            ext: ret,
            mime: typemap.mime[ret]
          }
          : {
            ext: null
          });
      }
    });
  };
  imgtype.mime = typemap.mime;
  if (typeof window != 'undefined' && window !== null) {
    return window.imgtype = imgtype;
  } else if (typeof module != 'undefined' && module !== null) {
    return module.exports = imgtype;
  }
});
