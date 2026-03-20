require! <[fs path]>
imgtype = require "../dist/index"

files = fs
  .readdir-sync path.join(__dirname, "samples")
  .filter (f) -> /\.jpg|svg|png|tif|gif/.exec(f)
  .map (f) -> path.join(__dirname, "samples", f)

console.log "#{files.length} file(s) found under #{path.join(__dirname, "samples")}. checking..."

<- Promise.all(
  files.map (f) ->
    (ret) <- imgtype(f) .then _
    (color) <- imgtype.colormode f .then _
    rf = path.relative(__dirname, f)
    console.log "#{color.padStart(10, ' ')} / #{ret.mime.padEnd(15, ' ')} for '#rf'"
).then _
