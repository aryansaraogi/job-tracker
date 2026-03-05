# Epic Brief — Job Tracker

Job Tracker is a multi-user web application that helps individuals manage their 
entire job search in one place. Users can track job applications through a fully
customizable status pipeline, view their applications in either a Kanban board or a list/table layout, and save job postings directly as entries in the pipeline (using a "Saved/Wishlist" status). A dedicated Portal Credentials Manager lets users securely store their login details for multiple job portals, with passwords masked at all times and accessible only via a copy-to-clipboard action. The app is built on the MERN stack, designed to run locally from day one, and structured for straightforward cloud deployment later.

## Context & Problem

Job seekers today juggle applications across many portals — LinkedIn, Indeed, 
Naukri, Glassdoor, and more. There is no single tool that combines:

1. **Application tracking** — knowing where each application stands across a custom, personal pipeline.
2. **Job bookmarking** — saving a job posting you found before you're ready to apply.
3. **Credential management** — safely recalling which email and password belongs to which portal, without resorting to sticky notes or plain text files.

Existing tools either track only applications (ignoring saved links and credentials) or are generic bookmark/password managers that lack job-specific context. The result is fragmented data spread across browser bookmarks, spreadsheets, and memory — leading to missed follow-ups, forgotten applications, and wasted time recovering portal logins.

## Who Is Affected

| Who | Pain |
|---|---|
| Individual job seekers | No unified place to track applications, saved jobs, and portal logins |
| Active multi-portal users | Constantly switching between sites, losing track of credentials |
| Anyone mid-search | Difficulty knowing which stage each application is at without a dedicated tool |

## Goals

- Give each user a **personal, isolated** job search workspace (multi-user, account-based)
- Unify **bookmarking + tracking** under one pipeline with a customizable status system
- Eliminate credential confusion with a **safe, masked portal credentials store**
- Provide **two views** (Kanban + List) so users can manage their pipeline the way they prefer
- Deliver a **deployable MERN app** that works locally now and can move to the cloud with minimal friction

## Out of Scope (for this Epic)

- Resume builder or document storage
- Email or calendar integrations
- Automated job scraping or browser extensions
