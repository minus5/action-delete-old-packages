const { getInput, setFailed, info } = require("@actions/core");
const { context } = require("@actions/github");
const deleteVersions = require("./delete-versions");

async function run() {
  try {
    const inputs = {
      owner: getInput("owner") || context.repo.owner,
      repo: getInput("repo") || context.repo.repo,
      keepCnt: Number(getInput("keepCnt")), // getInput converts ALL values to string!
      dryRun: getInput("dryRun"),
      token: getInput("token"),
    };
    info("Input values:");
    Object.entries(inputs).map((v) => info(v[0] + ": " + v[1]));
    if (inputs.dryRun === "false") inputs.dryRun = false; // getInput converts ALL values to string!
    if (inputs.dryRun) {
      info(
        "Dry run is NOT deleting packages, list below is what would be deleted, dryRun: " +
          Number(inputs.dryRun)
      );
    }
    const deleted = await deleteVersions(inputs);
    deleted.forEach((package) => {
      package.versions.forEach((v) => {
        info(`Deleted ${package.name} version ${v.version}`);
      });
    });
  } catch (error) {
    setFailed(error.message);
  }
}

run();
