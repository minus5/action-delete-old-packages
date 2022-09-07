const { getInput, setFailed, info } = require("@actions/core");
const { context } = require("@actions/github");
const deleteVersions = require("./delete-versions");

async function run() {
  try {
    const inputs = {
      owner: getInput("owner") || context.repo.owner,
      repo: getInput("repo") || context.repo.repo,
      keepCnt: getInput("keepCnt"),
      dryRun: getInput("dryRun"),
      token: getInput("token"),
    };
    info("Input values:");
    Object.entries(inputs).map((v) => info(v[0] + ": " + v[1]));
    const deleted = await deleteVersions(inputs);
    if (inputs.dryRun) {
      info(
        "Dry run is NOT deleting packages, list below is what would be deleted, dryRun: " + Number(inputs.dryRun)
      );
    }
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
