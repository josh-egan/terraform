var highlight = require('highlight.js')
var md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '""\'\'',
  langPrefix: 'language-',
  highlight: applySyntaxHighlighting
})
var TerraformError = require("../../error").TerraformError

module.exports = function(fileContents, options){

  return {
    compile: function(){
      return function (locals){
        return md.render(fileContents.toString().replace(/^\uFEFF/, ''))
      }
    },

    parseError: function(error){
      error.stack = fileContents.toString()
      return new TerraformError(error)
    }
  }
}

function applySyntaxHighlighting (code, lang) {
  if (lang && highlight.getLanguage(lang))
    return highlight.highlight(lang, code).value

  var result = highlight.highlightAuto(code);
  console.log("Code block language was not specified in markdown. Auto detected language: " + result.language)
  return result.value
}
