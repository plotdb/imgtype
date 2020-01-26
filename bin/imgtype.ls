require! <[fs ../dist/image-type.js]>

name = process.argv.2
if !name =>
  console.log "usage: img-type [filename]"
  process.exit!

buffer = fs.read-file-sync name
image-type buffer
  .then -> console.log it
