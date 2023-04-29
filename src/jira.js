/**
 * @typedef {Object} JiraIssueField
 * @property {string} name
 */

/**
 * @typedef {Object} JiraIssueFields
 * @property {string | undefined} summary
 * @property {string[] | undefined} labels
 * @property {JiraIssueField | undefined} priority
 * @property {JiraIssueField | undefined} issuetype
 * @property {JiraIssueField | undefined} status
 * @property {JiraIssueField | undefined} resolution
 * @property {JiraIssueField[] | undefined} fixVersions
 */

/**
 * @typedef {Object} JiraIssue
 * @property {string} key - Jira ID of the issue
 * @property {JiraIssueFields} fields
 */

/**
 * @returns {Promise<JiraIssue>}
 */
exports.getIssue = async function (id) {
  const response = await fetch(
    `${process.env.JIRA_API_HOST}/rest/api/latest/issue/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
      },
    }
  );
  return await response.json();
};
