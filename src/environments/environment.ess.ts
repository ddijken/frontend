// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  lbBaseURL: "https://scicat05.esss.lu.se:32223",
  fileserverBaseURL: "https://scicat06.esss.lu.se:32223",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  disabledDatasetColumns: ["archiveStatus", "retrieveStatus"],
  userProfileImageEnabled: true,
  facility: "ESS",
  localColumns: [
    "select",
    "datasetName",
    "runNumber",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId"
  ],
};
