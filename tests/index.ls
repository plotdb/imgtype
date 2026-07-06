require! <[fs path]>
imgtype = require "../dist/index"

traverse = (root) ->
  ret = []
  files = fs.readdir-sync root .map -> path.join(root, it)
  for file in files =>
    if fs.lstat-sync(file).is-directory! => ret ++= traverse(file)
    else ret.push file
  return ret

files = traverse(path.join(__dirname, "samples"))
  .filter (f) -> /\.jpg|svg|png|tif|gif/.exec(f)

console.log "#{files.length} file(s) found under #{path.join(__dirname, "samples")}. checking..."

<- Promise.all(
  files.map (f) ->
    (ret) <- imgtype(f) .then _
    (color) <- imgtype.colormode f .then _
    rf = path.relative(__dirname, f)
    console.log "#{color.padStart(10, ' ')} / #{ret.mime.padEnd(15, ' ')} for '#rf'"
).then _
