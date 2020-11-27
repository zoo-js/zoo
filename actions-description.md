## 🤖 Actions Description

| Name | Trigger | Description |
| -- | -- | -- |
| add-need-info | Issue labeled `need accurate info` | Used to remind applicant that the issue format is incorrect. |
| auto-invite | Issue labeled `auto invited` | Automatically invite applicant to join the organization based on issue. And will close the issue. |
| check-application | Issue labeled `💖 Application` | Check if the issue format is correct. If it is, will added `auto invited` label automatically, else added `need accurate info`. |
| check-need-info | Every 7 days | Issue will be closed when it labeled `need accurate info` but not active for a long time. |
| fix-need-info | Issue edit with `need accurate info` label | Check whether the revised format of issue is correct. If correct, will added `auto invited` label, else comment to remind. |
| labeler | Issue opened | For newly opened issue add `💖 Application` label. |
