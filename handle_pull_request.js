module.exports = handlePullRequest;

const core = require("@actions/core");

/**
 * Handle "pull_request" event
 */
async function handlePullRequest() {
    const eventPayload = require(process.env.GITHUB_EVENT_PATH);
    
    core.info(
              `Validating pull request for ${eventPayload.pull_request.html_url}`
              );
    
    if (eventPayload.pull_request.state !== "open") {
        core.info(`Pull request already closed, ignoring`);
        return;
    }
    
    if (eventPayload.pull_request.head.repo.fork) {
        core.setFailed(`Setting a auto merge is not allowed from forks`);
        process.exit(1);
    }
    
    const labels = eventPayload.pull_request.labels.map(label => label.name);
    
    if (labels.includes("doNotMerge")) {
        core.setFailed("Skipping PR merge, blocking label present: doNotMerge");
        process.exit(1);
    }
    
    if (!labels.includes("readyToMerge")) {
        core.setFailed("Skipping PR merge, missing required label: readyToMerge");
        process.exit(1);
    }
    
    core.info(`${data.html_url} passed Release PR Validation.`);
}
