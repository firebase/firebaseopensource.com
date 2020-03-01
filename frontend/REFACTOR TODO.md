Still some bugs and cleaups remaining before refactor is done. 

## Cleanup

- Refactor all .vue files' script parts to be typescript
- Remove // @ts-nocheck where is it set now (currently having issues with vetur not recognizing import paths)
- ADD Style Lint for .sass files
- Add Tests again
- Add "Featured" projects functioanlity again (if really needed)

## Bugs

### this.projectConfig.last_fetched.toDate() breaks

For some reason `this.projectConfig.last_fetched.toDate()` says toDate() is not a function even though it is ALWAYS a timestamp...