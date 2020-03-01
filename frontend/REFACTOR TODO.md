Still some bugs and stuff remaining before refactor is done. 

## Cleanup

- Refactor all .vue files' script parts to be typescript
- Remove // @ts-nocheck where is it set now (currently having issues with vetur not recognizing import paths)
- ADD Style Lint for .sass files
- Add Tests again
- CHECK: Add "Featured" projects functioanlity again if needed

## Bugs

### Links from the sidebar to subpages with multiple /'s in path break:

http://localhost:3000/projects/firebase/functions-samples/
e.g. https://firebaseopensource.com/projects/firebase/functions-samples/quickstarts/big-ben/readme.md/

### this.projectConfig.last_fetched.toDate() breaks

For some reason `this.projectConfig.last_fetched.toDate()` says toDate() os not a function even though it is always a timestamp...