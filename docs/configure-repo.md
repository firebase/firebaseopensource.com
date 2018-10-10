# Configure your repository

## Get Listed

All repositories on `github.com/firebase` are automatically listed on 
firebaseopensource.com. If you want to list a project outside the firebase org
send a pull request to the file [`additional-projects.json`][additional-projects].

## Configuration

### Basic Configuration

By default, your listing on FOSDC will be generated from the `README` file at the
root of your repository. However you can add a configuration file to your repository
to customize your appearance.

All configuration is performed by adding a file to your repository at the path
`.opensource/project.json`. It takes the following form:

```javascript
{
    // Display name for the project
    "name": "YOUR_PROJECT_NAME",
  
    // Platforms this repository supports. 
    // Options are Android, iOS, Web, and Games.
    "platforms": [
      // ...
    ],
  
    // Main content file
    // Default: README.md
    "content": "README.md",

    // Non-README markdown pages to render
    "pages" : [
        // ...
    ],
  
    // Related projects on Github, in the format $owner/$repo
    // Ex: "firebase/firebaseui-ios"
    "related": [
      // ...
    ],

    // (optional) Links to external resources
    "tabs": [
      // ...
    ]
  }
```

### Subpages

If your repository has multiple pages of Markdown documentation you would like to
display on FOSDC, add a reference to each one in the `pages` field of your configuration:

```javascript
{

    "pages": {
        "docs/page_one.md": "Page One Title",
        "docs/folder/page_two.md": "Page Two Title"
    }

}
```

Any links between your content pages (including your main page) will be re-written as relative
links on FOSDC. This allows you to create deep and connected documentation.

### Additional Tabs

If you want to add links to external resources related to your project,
 link them in the `tabs` field of your configuration:

```javascript
{

    // Ex: Adding Link to Reference Docs
    "tabs": [
        {
            "title": "Reference Docs",
            "href": "https://link.to/reference/docs"
        }
    ]

}
```

## Publishing

Publishing happens automatically every 24 hours. All pages are rendered as static HTML on a
nightly basis to maximize performance.

[additional-projects]:https://github.com/firebase/firebaseopensource.com/blob/master/config/additional_projects.json
