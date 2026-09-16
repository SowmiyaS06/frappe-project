app_name = "project"
app_title = "Project"
app_publisher = "Sowmiya"
app_description = "Frappe Project"
app_email = "sowmiya@example.com"
app_license = "mit"

# Send non-GET requests for this app's endpoints as native `application/json`
# bodies instead of form-encoded, per-key JSON-stringified values.
use_json_request_body = True

scheduler_events = {
    "cron": {
        "0 */8 * * *": [
            "project.indexer.scanner_job.run_scan"
        ],
    },
}

app_include_js = "/assets/project/js/chatbot.js"