const node = document.getElementById('root')

// purely for html syntax highlighting (not needed) :)
const html = (content, ...args) => content.map(line => `${line}${args.shift() || ''}`).join('')

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer()

  const { fieldPath, parameters } = plugin
  const { fields, visible } = parameters.instance

  plugin.toggleField(fieldPath, visible)

  const fieldsList = fields
    .split(',')
    .map(field => field.trim())

  const render = () => {
    const fieldValue = fieldsList
      .map(field => plugin.getFieldValue(field))
      .join(' ')

    plugin.setFieldValue(fieldPath, fieldValue)

    const content = html`
      <div class="BetterTitle">
        <span>${fieldValue}</span>
      </div>
    `

    node.innerHTML = content
  }

  render()

  fieldsList.forEach(field => plugin.addFieldChangeListener(field, render))
})
