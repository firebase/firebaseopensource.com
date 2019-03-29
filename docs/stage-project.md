# Stage your project

You can test changes to your firebaseopensource.com page by staging.

## Fetch your changes

To have the staging server fetch your content, navigate to this URL:

```
https://firebaseopensource.com/stageProject?org=YOUR_ORG&repo=YOUR_REPO&branch=YOUR_BRANCH
```

For example:

```
https://firebaseopensource.com/stageProject?org=samtstern&repo=BotTest&branch=staging-branch
```

If you omit the `branch` parameter, the content will be fetched from the `master` branch.

## View your changes

To see your staged changes, change `/projects/` to `/projects-staging`. For example:

```
https://firebaseopensource.com/projects-staging/samtstern/BotTest/
```

Note that relative links throughout the site will still point to production, so you
have to manually perform this URL edit on each page you'd like to see in staging.