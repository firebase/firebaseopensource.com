Still some bugs and stuff remaining before refactor is done. 

## Cleanup

- Refactor all .vue files' script parts to be typescript

## Bugs

### Links from the sidebar to subpages with multiple /'s in path break:

http://localhost:3000/projects/firebase/functions-samples/
e.g. https://firebaseopensource.com/projects/firebase/functions-samples/quickstarts/big-ben/readme.md/

### this.projectConfig.last_fetched.toDate() breaks

For some reason `this.projectConfig.last_fetched.toDate()` says toDate() os not a function even though it is always a timestamp...