const slugRegex = /[^\w\d]/gi;

/**
 * @param {string} text
 */
function slugify(text) {
  return text.replaceAll(slugRegex, "-");
}

const zkTag = (desc) => (value) => {
  if (!value) return;
  const metaValue = typeof value === "string" ? value : value.name;
  return `:jira-${desc}-${slugify(metaValue)}:`;
};

class ZkTemplate {
  constructor(issue) {
    /** @type {import("./jira").JiraIssue} */
    this.issue = issue;
  }

  renderMetaProp(name, value) {
    if (!name || !value) return;
    let metaValue;
    if (Array.isArray(value) && value.length) {
      metaValue = value.join(" ");
    } else if (typeof value === "string") {
      metaValue = value;
    } else {
      metaValue = value.name;
    }
    if (!metaValue) return;
    return `${name}: ${metaValue}`;
  }

  renderMetaLines() {
    const fields = this.issue.fields;
    const now = new Date();
    return [
      fields.priority && fields.priority.name !== "Undefined"
        ? this.renderMetaProp("priority", zkTag("p")(fields.priority))
        : "",
      this.renderMetaProp("type", zkTag("type")(fields.issuetype)),
      this.renderMetaProp("status", zkTag("status")(fields.status)),
      this.renderMetaProp("labels", fields.labels?.map(zkTag("label"))),
      this.renderMetaProp("resolution", zkTag("res")(fields.resolution)),
      this.renderMetaProp("fixVersions", fields.fixVersions?.map(zkTag("fix"))),
      this.renderMetaProp("last-fetched", now.toISOString()),
    ].filter(Boolean);
  }

  render() {
    const lines = [];
    lines.push(`# ${this.issue.key} ${this.issue.fields.summary}`);
    lines.push("");
    lines.push(`${process.env.JIRA_API_HOST}/${this.issue.key}`);
    lines.push("");
    lines.push("```");
    lines.push(...this.renderMetaLines());
    lines.push("```");
    return lines.join("\n");
  }
}

module.exports = { ZkTemplate };
