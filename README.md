### Project

Frappe Project

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app project
```

### Reindexing after a parser update

The Python indexer uses Tree-sitter. After installing or updating the app
dependencies, run a full scan. The scheduled scan job rebuilds the Chroma
embeddings from the same SQLite index, so retrieval does not retain stale units:

```bash
cd $PATH_TO_YOUR_BENCH
./env/bin/pip install -e apps/project
bench --site ai.local execute project.indexer.scanner_job.execute_scan
bench build --app project
bench restart
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/project
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade
### CI

This app can use GitHub Actions for CI. The following workflows are configured:

- CI: Installs this app and runs unit tests on every push to `develop` branch.
- Linters: Runs [Frappe Semgrep Rules](https://github.com/frappe/semgrep-rules) and [pip-audit](https://pypi.org/project/pip-audit/) on every pull request.


### License

mit
