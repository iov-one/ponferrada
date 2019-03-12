## Test running

In order to run snapshot tests for the storybook you should issue `yarn test` command inside storybook package directory or in root directory of the multi-package repository. But if you want to provide additional options to test runner you should change your directory to the storybook package. In this case you can run test against specific components providing `-t=<Snapshot name patter>`, like `yarn test -t="Button in desktop screen"`

## Update snapshot

In case if you need to update JEST snapshot after implementing different changes in the UI you need to issue `yarn test -u` command. This command will update all snapshots. But if you want to update only specific snapshot you should run `yarn test -u -t="<Snapshot name pattern>"`

## Success test

![test](./img/test-success.png)

## Unsuccess test

![test](./img/test-unsuccess.png)
