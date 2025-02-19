export class SidebarSection {
  title: string = ''
  pages: SelectableLink[] = []

  constructor(title: string, pages: SelectableLink[]) {
    this.title = title
    this.pages = pages
  }
}

export class SelectableLink {
  title: string = ''
  href: string = ''
  outbound: boolean = false

  constructor(title: string, href: string, outbound = false) {
    this.title = title
    this.href = href
    this.outbound = outbound
  }
}
