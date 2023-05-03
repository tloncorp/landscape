# Email Templates

This directory contains the email templates used by `%bark`.

## Workflow

1. Copy the `base.html` template to a new file and name it with a distinctive slug. e.g., `landscape-weekly-digest.html`.
2. Edit the template to your liking, including adding hooks that will be used by Mailchimp to inject content. The syntax is available here: https://mailchimp.com/developer/transactional/docs/templates-dynamic-content/
3. Use an inline CSS tool to inline the CSS.
- https://templates.mailchimp.com/resources/inline-css/
- https://htmlemail.io/inline/
4. Copy the resulting HTML into Mailchimp and save it as a template.
5. Send a test email using the `send-template` thread. The template name should be the slug you used in step 1.
