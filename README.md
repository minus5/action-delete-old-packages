# action-delete-old-packages
Deletes old packages in repository and keeps required number of packages with major version.

## Inputs
## 'keepCnt'
number of major package versions to keep after deletion, **default: 10**

## 'dryRun'
Dry run **is not deleting** packages just logs what should be, **default: false**
- deleted 

## Build and deploy
Build is done using [@vercel/ncc](https://github.com/vercel/ncc) to compile code and modules into one file used for distribution and to avoid committing `node_modules` folder.  
### Build using
```
$ npm run prepare
```
or for manual build:
```
ncc build index.js --license licenses.txt
```
If this is first build commit `dist` folder
```
git add action.yml dist/index.js
```

### deploy by committing new version
```
git commit -m "My new version"
git tag -a -m "My action release" v1.1
git push --follow-tags
```

## Example using action
Add workflow config to root in your repository:
```
.github/workflows/package-cleanup.yml
```

Example of package-cleanup.yml workflow:
```yml
on:
  registry_package:
  workflow_dispatch:

jobs:
  delete_package_versions:
    runs-on: ubuntu-latest
    name: Deletes old packages in repository
    steps:
    - id: package-cleanup
      uses: minus5/action-delete-old-packages@v1.3
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        keepCnt: 5
        dryRun: false
```

### Using action from private repository
There are few more steps in action configuration to enable usage of private action.
This is kind of hack because GitHub doesn't support using actions from other private repository than
repository action is run on. For this hack we will use [actions/checkout](https://github.com/actions/checkout) Here is example of how to do it.

```yml
on:
  registry_package:
  workflow_dispatch:

jobs:
  delete_package_versions:
    runs-on: ubuntu-latest
    name: Deletes old packages in repository
    steps:
      # checkout repository where workflow is run on
      - id: checkout-repository
        uses: actions/checkout@v2
      # checkout action from private repository that we want run in workflow
      # action is placed in current checked out repository to overcome github restriction running actions from other private repositories
      # Note: token used for action checkout from private repo defers from one used by action itself because has access only to 
      - id: checkout-action
        uses: actions/checkout@v2
        with:
          repository: minus5/action-delete-old-packages
          ref: v1.3
          token: ${{ secrets.GITHUB_PAT }}
          path: .github/actions/action-delete-old-packages
      # for action steps debug display current folder tree
      #- id: show-tree
      #  run: pwd;find . -type d -print 2>/dev/null|awk '!/\.$/ {for (i=1;i<NF-1;i++){printf("│   ")}print "├── "$NF}'  FS='/'
      # finally run action
      - id: package-cleanup
        # here we change reference to checked out action to run it
        uses: ./.github/actions/action-delete-old-packages
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          keepCnt: 5
          dryRun: false

```
Please note that **secrets.GITHUB_PAT** is GitHub user personal access token with enough rights to access action private repo.
Other interesting issue is that this hack doesn't work with **act local testing** this is something to investigate.

## Testing locally using act
To test locally using [act](https://github.com/nektos/act) here are few steps  
go to project where workflow is located e.g.
```
$ cd ~/work/web-js
```
run act to list steps e.g.
```
$ act workflow_dispatch -l
```
finally run act to see how your workflow is working (example for workflow above)
```
$ act workflow_dispatch -s GITHUB_TOKEN=[your github token]
```
for more check [ACT tool](https://github.com/nektos/act) ...


## References
How to create JS action:  
https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

Toolkit for writing action exposing GitHub options:  
https://github.com/actions/toolkit

Tool for compiling Node.js into single file:  
https://github.com/vercel/ncc

Using private action on private repo  
https://github.com/actions/checkout  
other possible options (not tested)  
https://github.com/bagbyte/use-private-action  
https://github.com/nick-invision/private-action-loader

ACT tool to run actions locally for testing  
https://github.com/nektos/act

Action originally created by  
https://github.com/djelusic/delete-packages-action