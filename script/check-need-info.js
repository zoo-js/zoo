require('dotenv').config();
const { Octokit } = require('@octokit/rest');

var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

const {
  GH_TOKEN: githubToken
} = process.env;

const octokit = new Octokit({ auth: `token ${githubToken}` });

const owner = 'zoo-js';
const repo = 'zoo';

var since = dayjs.utc().subtract(15, 'day').format();
var lastTime = dayjs.utc().subtract(7, 'day');

async function main() {
  const res = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'open',
    labels: 'need accurate info',
    since,
  });

  const targetArr = res.data;

  for (var i = 0; i < targetArr.length; i++) {
    let issue = targetArr[i];
    let updateTime = dayjs.utc(issue.updated_at);
    if (updateTime.isSameOrBefore(lastTime)) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issue.number,
        body: getIssueBody(issue.user.login),
      });
  
      await octokit.issues.update({
        owner,
        repo,
        issue_number: issue.number,
        state: 'closed'
      });
    }
  }
};

function getIssueBody(issueAuth) {
  return `⛱ Hi, @${issueAuth}. This issue will be closed because it has not been active for a long time. If you have any questions, please comment below.

⛱ 你好，@${issueAuth}。这个 issue 由于较长时间未活跃，将要被关闭，如果你有任何问题，欢迎在下方评论。

<!-- Created by zoo-js-bot with GitHub Actios. -->
`
};

(async () => {
  await main();
})();
