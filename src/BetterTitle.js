import html from './html'

export default class BetterTitle {
  constructor(plugin) {
    const { parameters, fieldPath } = plugin
    const { visible, fields } = parameters.instance
    const { apiToken } = parameters.global

    this._itemTypes = plugin.site.relationships.item_types.data.map(
      link => plugin.itemTypes[link.id]
    )
    this._plugin = plugin
    this._fieldPath = fieldPath
    this._client = new Dato.SiteClient(apiToken)
    this._fields = fields
      .split(/(?!\B(\(|\[)[^([]*),(?![^([]*(\)|\])\B)/)
      .filter(field => field !== undefined)
      .map(field => field.trim())

    plugin.toggleField(fieldPath, visible)
  }

  static cleanValue = value => value.replace(/(:.+|\(.+)/g, '')

  static regexReplaceFieldValue = (field, fieldValue) => {
    const fieldReplace = field.match(/(?!:)(?<=\()[^(].+(?=\))/gm)

    if (!fieldReplace) return fieldValue

    const [regex, replaceValue] = fieldReplace[0]
      .split(/(?<=(?<!\\)\/),(?=(?:\s+|)(?:'|"))/g)
      .map(value => value.trim().slice(1, -1))

    const newFieldValue = fieldValue
      .toString()
      .replace(new RegExp(regex, 'g'), replaceValue)

    return newFieldValue
  }

  get plugin() { return this._plugin }

  get itemTypes() { return this._itemTypes }

  get fieldPath() { return this._fieldPath }

  get client() { return this._client }

  get fields() { return this._fields }

  findItemValue = async (field) => {
    const [fieldPath, linkField] = field.split(':')
    const itemId = this.plugin.getFieldValue(fieldPath)
    const item = await this.client.items.find(itemId)
    const fieldValue = item[this.constructor.cleanValue(linkField)]

    return fieldValue
  }

  findItemTypeValue = fields => async (fieldItem) => {
    let fieldValue

    // If the value is not available we want to return an empty variable
    try {
      const { cleanValue, regexReplaceFieldValue } = this.constructor
      const [linkName, linkField] = fieldItem.split(':')
      const field = fields[linkName]
      const link = field[linkField]
      const item = await this.client.items.find(link)
      const value = item[cleanValue(linkField)]

      fieldValue = regexReplaceFieldValue(linkField, value)
    } catch {
      fieldValue = ''
    }

    return fieldValue
  }

  getFieldValue = async (field) => {
    let fieldValue

    const { cleanValue, regexReplaceFieldValue } = this.constructor

    if (field.match(/\w+:\[/)) {
      const [fieldPath, rawFieldsToUse] = field.split(':[')

      const fieldValues = await this.plugin.getFieldValue(fieldPath)

      const fields = fieldValues.reduce((reducedFields, currentFieldValue) => {
        const currentItem = this.itemTypes
          .find(itemType => itemType.id === currentFieldValue.itemTypeId)

        return {
          ...reducedFields,
          [currentItem.attributes.api_key]: currentFieldValue,
        }
      }, {})

      const fieldsToUse = rawFieldsToUse.slice(0, -1)
        .trim()
        .replace(/\s/g, '')
        .split(',')

      fieldValue = (
        await Promise.all(fieldsToUse.map(this.findItemTypeValue(fields)))
      ).join(' ')
    } else if (field.match(/\w+:/)) {
      fieldValue = await this.findItemValue(field)
    } else {
      fieldValue = this.plugin.getFieldValue(cleanValue(field))
    }

    fieldValue = regexReplaceFieldValue(field, fieldValue)

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
