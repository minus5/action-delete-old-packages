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
      uses: minus5/action-delete-old-packages@v1.0
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        keepCnt: 5
        dryRun: false
```

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

ACT tool to run actions locally for testing  
https://github.com/nektos/act

Action originally created by  
https://github.com/djelusic/delete-packages-action