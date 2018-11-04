import BetterTitle from './BetterTitle'

const node = document.getElementById('root')

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer()

  // // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  // plugin._itemFields = plugin.itemType.relationships.fields.data
  //   .reduce((fields, { id }) => {
  //     const field = plugin.fields[id]
  //
  //     return { ...fields, [field.attributes.api_key]: field }
  //   }, {})
  //
  // // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  // plugin.getField = field => plugin._itemFields[field]

  const betterTitle = new BetterTitle(plugin)

  const render = async () => (node.innerHTML = await betterTitle.render())

  render()

  betterTitle.fields
    .map(field => BetterTitle.cleanValue(field))
    .forEach(field => plugin.addFieldChangeListener(field, render))
})
