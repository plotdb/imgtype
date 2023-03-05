# imgtype

Image type Hint.


## Usage

require! <[imgtype]> # only if use in nodejs
imgtype(obj).then ({ext, mime}) -> ... # ext = null if can't figure it out


## Mime mappaing

You can use `imgtype.mime["..."]` to get the mime type for a specific file extension, such as:

    imgtype.mime.svg
    imgtype.mime.jpg


Supported extensions include:

 - `bmp`: `image/bmp`
 - `gif`: `image/gif`
 - `png`: `image/png`
 - `svg`: `image/svg+xml`
 - `tif`: `image/tiff`
 - `jpg`: `image/jpeg`



## Approach

Image file type can be detected throught the first two bytes of the file:

 * TIF
   - SU : 49 49
   - TU : 4D 4D
 * BMP : Qk : 42 4D
 * JPG : /9 : FF D8 FF EO ( Starting 2 Byte will always be same)
 * PNG : iV : 89 50 4E 47
 * GIF : R0 : 47 49 46 38
 * SVG 
   - `<?xml` or `<svg`, with possibly space ahead.
   - PD : 3C 3F  `<?`
   - PH : 3C 73  `<s`
   - ID : 20 3C  ` <`
   - IC : 20 20  `  `

While image files begin with these pattern, there might still be other file formats that begin with the same pattern. Furthermore, there might be exceptions for SVG files.

Thus, this should only be considered as a hint instead of a correct result.


## License

MIT
