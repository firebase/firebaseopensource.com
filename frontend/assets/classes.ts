export class SidebarSection {
    title: String = ''
    pages: SelectableLink[] = []

    constructor (title: String, pages: SelectableLink[]) {
      this.title = title
      this.pages = pages
    }
}

export class SelectableLink {
    title: String = ''
    href: String = ''
    outbound: Boolean = false

    constructor (title: String, href: String, outbound = false) {
      this.title = title
      this.href = href
      this.outbound = outbound
    }
}
