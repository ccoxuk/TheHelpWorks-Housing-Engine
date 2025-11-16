# Legal Statutes Pack

This directory contains UK housing-related legal statutes in PDF format with accompanying metadata files.

## Part 01 - Housing Act 2004 (HHSRS)

Added via PR #3: [Add HelpWorks Engine – Part 01 legal statutes pack](https://github.com/ccoxuk/TheHelpWorks-Housing-Engine/pull/3)

This pack includes:
- Housing Act 2004 - Housing Health and Safety Rating System (HHSRS)

## File Structure

Each statute consists of:
- **PDF file**: The complete statute document in PDF format
- **Metadata file**: JSON file containing statute information and metadata

### Naming Convention

All files use snake_case naming:
- PDF: `{identifier}_statute_{details}.pdf`
- Metadata: `{identifier}_statute_{details}_metadata.json`

### Metadata Schema

Each metadata JSON file contains the following required fields:

```json
{
  "title": "Full title of the statute",
  "citation": "Official citation reference (e.g., '2004 c. 34')",
  "statute_date": "Date in ISO format (YYYY-MM-DD)",
  "source_url": "URL to official source (if available)",
  "file_name": "Name of the corresponding PDF file",
  "added_by": "GitHub username of contributor",
  "schema_version": "Version of metadata schema (e.g., '1.0.0')",
  "last_updated": "ISO 8601 timestamp of last update"
}
```

#### Example

```json
{
  "title": "Housing Act 2004 - Housing Health and Safety Rating System (HHSRS)",
  "citation": "2004 c. 34",
  "statute_date": "2004-11-18",
  "source_url": "",
  "file_name": "stat09_statute_10_e6_housing_act_2004_hhsrs.pdf",
  "added_by": "ccoxuk",
  "schema_version": "1.0.0",
  "last_updated": "2025-11-16T03:57:00Z"
}
```

## Contents

### Current Statutes

| Identifier | Title | Citation | Date | Metadata |
|------------|-------|----------|------|----------|
| stat09 | Housing Act 2004 - Housing Health and Safety Rating System (HHSRS) | 2004 c. 34 | 2004-11-18 | [metadata](stat09_statute_10_e6_housing_act_2004_hhsrs_metadata.json) |

## Contributing

When adding new statutes:

1. Use snake_case filenames with `.pdf` extension
2. Create corresponding `_metadata.json` file with all required fields
3. Update this README.md with the new statute details
4. Update the root-level `MASTER_AllTabs_Index.json`
5. Reference the PR that added the statute

## Schema Version History

- **1.0.0** (2025-11-16): Initial schema with 8 required fields
