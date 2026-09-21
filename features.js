// DigitalOcean M.A.R.S. — Agent Harness Runtime feature catalog.
//
// Source: internal DO Slack announcements (#announcements, #atv-do-open-discussion,
// #marketing-and-comms-public), Private Preview (Aug 2026) -> Public Preview
// launch Sept 22, 2026. This is pre-GA / recently-launched product info —
// treat as internal reference content, not a public marketing asset, until
// GA messaging is finalized.
//
// Agent Harness Runtime is one of the two M.A.R.S. products (the other being
// Action Gateway). This app is scoped to Harness Runtime only.

export const OVERVIEW = {
  name: "Agent Harness Runtime",
  icon: "🛰️",
  tagline: "The managed execution environment where AI agents run, persist, and scale.",
  summary:
    "Agent Harness Runtime gives every agent session a dedicated, isolated, resumable " +
    "sandbox — so you don't have to provision VMs, manage containers, or build your own " +
    "pause/resume plumbing to run Claude Code, Codex CLI, or a custom agent in the cloud.",
};

// Each feature's `demo` is an illustrative sample (sample CLI/API/config
// syntax showing the shape of the feature) — for walkthrough purposes, not a
// literal transcript from a real M.A.R.S. session.
export const FEATURES = [
  {
    name: "Multi-framework support",
    icon: "🧩",
    desc: "Runs Claude Code, Codex CLI, OpenCode, LangGraph, and Hermes today; CrewAI support is planned.",
    detail: "Bring a custom agent too — package it as a standard OCI container image and the harness runs it like any supported framework.",
    demoLang: "yaml",
    demo:
`# agents.yaml
harness:
  framework: claude-code   # or: codex-cli, opencode, langgraph, hermes
  image: registry.example.com/my-custom-agent:latest  # optional: bring your own OCI image
`,
  },
  {
    name: "Firecracker microVM isolation",
    icon: "🧱",
    desc: "Agent-generated code executes inside dedicated, hardware-isolated microVMs.",
    detail: "Each session gets its own microVM boundary, so one agent's generated code can't touch another session's filesystem, memory, or network path.",
    demoLang: "bash",
    demo:
`$ agents run --framework codex-cli --task "refactor the auth module"
✔ Provisioning Firecracker microVM (isolated, ephemeral)
✔ Session sandboxed — no shared filesystem or network with other sessions
Session ID: sess_8f2a1c
`,
  },
  {
    name: "Sub-second sessions",
    icon: "⚡",
    desc: "Sessions start in under a second and resume from pause in roughly 200ms.",
    detail: "No cold-start container pulls or VM boot waits in the interactive path — the harness keeps sessions warm and resumable.",
    demoLang: "bash",
    demo:
`$ time agents run --framework claude-code
Session started in 0.87s

$ agents resume sess_8f2a1c
Resumed in 210ms
`,
  },
  {
    name: "Human approval gates",
    icon: "✋",
    desc: "Configurable approval checkpoints for destructive, irreversible, or high-cost actions.",
    detail: "Define which actions need a human sign-off (e.g. force-push, delete, spend over a threshold) before the agent is allowed to execute them.",
    demoLang: "yaml",
    demo:
`approvals:
  - action: shell.exec
    pattern: "rm -rf *"
    require_human: true
  - action: git.push
    pattern: "--force"
    require_human: true

# During a run:
⏸  Waiting for approval: force-push to main. Approve? [y/N]
`,
  },
  {
    name: "Native GitHub integration",
    icon: "🐙",
    desc: "OAuth-based repo cloning, branching, committing, and opening PRs.",
    detail: "No personal access tokens to manage — connect once via OAuth and the harness handles clone/branch/commit/PR as part of the agent's workflow.",
    demoLang: "bash",
    demo:
`$ agents connect github
✔ Authorized via OAuth (no personal access token needed)

$ agents run --repo my-org/inference-sdk --task "fix flaky test in test_cache.py"
✔ Cloned my-org/inference-sdk
✔ Created branch fix/flaky-cache-test
✔ Committed 1 file
✔ Opened PR #482
`,
  },
  {
    name: "Pause, resume, and handoff",
    icon: "🔁",
    desc: "Move a session across devices or hand it off to a teammate mid-task.",
    detail: "A session's full state travels with it — start on your laptop, pause, and resume on another machine or in another person's account.",
    demoLang: "bash",
    demo:
`$ agents pause sess_8f2a1c
✔ Session paused, state saved

$ agents handoff sess_8f2a1c --to teammate@company.com
✔ Session handed off

# on the teammate's machine
$ agents resume sess_8f2a1c
✔ Resumed in 194ms
`,
  },
  {
    name: "Checkpoint and fork API",
    icon: "🌱",
    desc: "Branch new work from any point in a prior session.",
    detail: "Roll back to a checkpoint and fork a new session from it — useful for trying multiple approaches from the same starting state without re-running setup.",
    demoLang: "http",
    demo:
`POST /v1/sessions/sess_8f2a1c/checkpoints
{ "label": "before-refactor" }
→ { "checkpoint_id": "ckpt_3391" }

POST /v1/sessions/fork
{ "checkpoint_id": "ckpt_3391" }
→ { "session_id": "sess_772", "forked_from": "ckpt_3391" }
`,
  },
  {
    name: "Port forwarding",
    icon: "🔌",
    desc: "Preview agent-created services from your local machine.",
    detail: "If an agent stands up a dev server inside its sandbox, forward the port and preview it in your own browser without deploying anywhere.",
    demoLang: "bash",
    demo:
`$ agents ports forward sess_8f2a1c --port 3000
✔ Forwarding localhost:3000 -> sandbox:3000
  Open http://localhost:3000 to preview the agent's dev server
`,
  },
  {
    name: "Webhooks & scheduled runs",
    icon: "⏰",
    desc: "Trigger agent executions on events or a schedule, not just interactively.",
    detail: "Kick off a session from a webhook (e.g. a new GitHub issue) or on a cron-style schedule for recurring agent work.",
    demoLang: "yaml",
    demo:
`triggers:
  - type: webhook
    on: github.issue.opened
    task: "triage and label this issue"
  - type: schedule
    cron: "0 8 * * MON"
    task: "open a weekly dependency-update PR"
`,
  },
  {
    name: "Single agents.yaml config",
    icon: "📄",
    desc: "One file configures harness, compute shape, budget, tools, and secrets.",
    detail: "Define the runtime, resource size, spend limits, tool access, and secret references for a session declaratively, checked into your repo alongside the code.",
    demoLang: "yaml",
    demo:
`harness:
  framework: claude-code
  compute: standard-2vcpu-4gb
budget:
  max_usd: 5.00
tools:
  toolbelt: [github, jira]
secrets:
  - name: NPM_TOKEN
    from: vault://npm_token
`,
  },
];
