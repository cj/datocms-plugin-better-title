// purely for html syntax highlighting (not needed) :)
const html = (content, ...args) => content.map(line => `${line}${args.shift() || ''}`).join('')

export default html
