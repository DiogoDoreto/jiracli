#!/usr/bin/env node

const { program } = require("commander");
const { getIssue } = require("./jira");
const { ZkTemplate } = require("./zk");

program
  .command("zk")
  .description("Renders a new zk note for a jira issue")
  .argument("<string>", "Jira ID")
  .action(async (id) => {
    const issue = await getIssue(id);
    const zk = new ZkTemplate(issue);
    console.log(zk.render());
  });

program.parse();
