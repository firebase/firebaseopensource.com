export class SidebarSection {
    title: String = ''
    expanded: Boolean = false
    pages: SelectableLink[] = []

    constructor (title: String, pages: SelectableLink[], expanded = false) {
      this.title = title
      this.pages = pages
      this.expanded = expanded
    }
}

export class SelectableLink {
    title: String = ''
    href: String = ''
    selected: Boolean = false // TODO: Not needed, REMOVE
    outbound: Boolean = false

    constructor (title: String, href: String, selected = false, outbound = false) {
      this.title = title
      this.href = href
      this.selected = selected
      this.outbound = outbound
    }
}
