import html from './html'

export default class BetterTitle {
  constructor({ parameters, fieldPath, ...plugin }) {
    const { visible, fields } = parameters.instance
    const { apiToken } = parameters.global

    this._plugin = plugin
    this._fieldPath = fieldPath
    this._client = new Dato.SiteClient(apiToken)
    this._fields = fields.split(',').map(field => field.trim())

    plugin.toggleField(fieldPath, visible)
  }

  get plugin() { return this._plugin }

  get fieldPath() { return this._fieldPath }

  get client() { return this._client }

  get fields() { return this._fields }

  getFieldValue = async (field) => {
    const { plugin, client } = this

    if (field.includes(':')) {
      const [fieldPath, linkField] = field.split(':')
      const itemId = plugin.getFieldValue(fieldPath)
      const item = await client.items.find(itemId)

      return item[linkField]
    }

    return plugin.getFieldValue(field)
  }

  async render() {
    const {
      fields,
      plugin,
      fieldPath,
      getFieldValue,
    } = this

    const fieldValue = (await Promise.all(fields.map(getFieldValue))).join(' ')

    plugin.setFieldValue(fieldPath, fieldValue)

    return html`
      <div class="BetterTitle">
        <span>${fieldValue}</span>
      </div>
    `
  }
}
