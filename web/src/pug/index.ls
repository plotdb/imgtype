lc = {}
view = new ldview do
  root: document.body
  action: input: do
    file: ({node}) ->
      (ret) <- imgtype(node.files.0).then _
      (mode) <- imgtype.colormode(node.files.0) .then _
      ret.colormode = mode
      lc.output = JSON.stringify(ret)
      view.render!
  handler: do
    output: ({node}) -> node.innerText = lc.output or ''
