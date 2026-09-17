# project/indexer/scanner_job.py
import frappe
from project.embeddings.index_embeddings import index_all_records
from project.indexer.scanner import scan_bench

def run_scan():
    """Called by the scheduler every 8 hours. Just hands off to the
    long-running worker queue rather than executing inline — full
    bench scans can take well past the default queue's timeout."""
    frappe.enqueue(
        method="project.indexer.scanner_job.execute_scan",
        queue="long",
        timeout=3600,  # 1 hour ceiling, adjust once you know real scan duration
    )

def execute_scan():
    bench_path = frappe.utils.get_bench_path()
    db_path = frappe.get_site_path("private", "files", "project", "code_index.sqlite3")
    result = scan_bench(bench_path=bench_path, db_path=db_path)
    index_all_records(db_path=db_path, rebuild=True)
    frappe.logger().info(f"Code index scan complete: {result}")
