import html from './html'

export default class BetterTitle {
  constructor({ parameters, fieldPath, ...plugin }) {
    const { visible, fields } = parameters.instance
    const { apiToken } = parameters.global

    this._plugin = plugin
    this._fieldPath = fieldPath
    this._client = new Dato.SiteClient(apiToken)
    this._fields = fields.split(/(?<=(?:\w|\))),/).map(field => field.trim())

    plugin.toggleField(fieldPath, visible)
  }

  static cleanValue = value => value.replace(/(:.+|\(.+)/g, '')

  get plugin() { return this._plugin }

  get fieldPath() { return this._fieldPath }

  get client() { return this._client }

  get fields() { return this._fields }

  getFieldValue = async (field) => {
    const { cleanValue } = this.constructor

    let fieldPath = field
    let linkField
    let fieldValue

    const fieldReplace = fieldPath.match(/(?<=\()[^(].+(?=\))/gm)

    if (fieldPath.match(/\w+:/)) {
      [fieldPath, linkField] = field.split(':')
      const itemId = this.plugin.getFieldValue(fieldPath)
      const item = await this.client.items.find(itemId)

      fieldValue = item[cleanValue(linkField)]
    } else {
      fieldValue = this.plugin.getFieldValue(cleanValue(field))
    }

    if (fieldReplace) {
      const [regex, replaceValue] = fieldReplace[0]
        .split(/(?<=(?<!\\)\/),(?=(?:\s+|)(?:'|"))/g)
        .map(value => value.trim().slice(1, -1))

      fieldValue = fieldValue
        .toString()
        .replace(new RegExp(regex, 'g'), replaceValue)
    }

    return fieldValue
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
