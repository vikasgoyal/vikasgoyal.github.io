# Rego, Explained by Example

Author: Vikas Goyal
Source: https://vikasgoyal.github.io/agentic/rego-primer.html
Updated: 2026-11-23
Syntax: Rego v1 (OPA 1.x). All examples require `if` on rule bodies and `contains` on partial set rules.

Rego is the declarative policy language of Open Policy Agent (OPA). You describe what must be true for a decision, OPA evaluates it against JSON input, and returns a JSON decision.

## Mental model

OPA is a function: `decision = evaluate(policy, input, data)`.

- `input`: the request being decided, supplied per query. Example: `input.user.role`.
- `data`: loaded facts (JSON/YAML) and every rule from every package. Example: `data.reports.r1.owner`, `data.httpapi.authz.allow`.
- Rego is not a scripting language. No loops you write, no mutation, no ordered side effects. A rule's value is defined only if all its assertions can be made true.

## Anatomy of a policy

```rego
package httpapi.authz

default allow := false

# Admins can do anything
allow if {
    input.user.role == "admin"
}

# Analysts and viewers can read reports
allow if {
    input.method == "GET"
    input.path[0] == "reports"
    input.user.role in {"analyst", "viewer"}
}

# Owners can edit or delete their own report
allow if {
    some id
    input.method in {"PUT", "DELETE"}
    input.path = ["reports", id]
    data.reports[id].owner == input.user.name
}
```

- `package` namespaces rules; this decision is at `data.httpapi.authz.allow`.
- `default` supplies a value when no body matches. Without it the rule is undefined, not false.
- Multiple definitions of the same rule are OR.
- Lines inside one body are AND.
- `some id` declares a local variable Rego searches for.
- `=` is unification: checks the path shape and binds `id` in one step.

Example evaluation with data `{"reports": {"r1": {"owner": "alice"}, "r2": {"owner": "bob"}}}`:

| user | role | method | path | allow | why |
|---|---|---|---|---|---|
| bob | viewer | DELETE | reports/r2 | true | rule 3: bob owns r2 |
| bob | viewer | DELETE | reports/r1 | false | rule 3 fails on owner check |
| zoe | admin | DELETE | reports/r1 | true | rule 1 |
| alice | analyst | GET | reports | true | rule 2 |
| bob | guest | GET | reports | false | rule 2 fails on role |

## Logic

- AND: conditions on separate lines in one body.
- OR: define the same rule more than once.
- NOT: `not expr` succeeds when expr is false or undefined.
- IN: `x in collection` for arrays, sets and object values.
- One-condition rules can drop braces: `allow if input.user.role == "admin"`.

## The four rule shapes

```rego
# 1. Complete rule: one value
default allow := false
allow if input.user.role == "admin"
max_upload_mb := 50
tier := "gold" if input.user.spend > 10000

# 2. Partial set rule: collect many values (gather all violations)
deny contains msg if {
    not input.user.verified
    msg := "user is not verified"
}
deny contains msg if {
    input.amount > 1000
    msg := sprintf("amount %v exceeds limit", [input.amount])
}

# 3. Partial object rule: build a map
role_of[name] := role if {
    some u in data.users
    name := u.name
    role := u.role
}

# 4. Function
is_owner(user, id) if data.reports[id].owner == user
```

A complete rule that yields two different values for the same input is a runtime conflict error. Use a partial set or an `else` chain instead.

## Iteration and collections

```rego
has_admin if {                      # existential
    some u in data.users
    u.role == "admin"
}

all_pinned if {                     # universal (true for empty input)
    every c in input.containers {
        not endswith(c.image, ":latest")
    }
}

admins   := {u.name | some u in data.users; u.role == "admin"}   # set
names    := [u.name | some u in data.users]                      # array
roles_by := {u.name: u.role | some u in data.users}              # object

some key, value in input.labels     # object iteration
some i, item in input.items         # array iteration with index
```

## Worked example: Kubernetes admission (Conftest style)

```rego
package k8s.pods

deny contains msg if {
    input.kind == "Pod"
    some c in input.spec.containers
    not c.resources.limits.memory
    msg := sprintf("container %q has no memory limit", [c.name])
}

deny contains msg if {
    input.kind == "Pod"
    some c in input.spec.containers
    endswith(c.image, ":latest")
    msg := sprintf("container %q uses the :latest tag", [c.name])
}

deny contains msg if {
    input.kind == "Pod"
    some c in input.spec.containers
    c.securityContext.privileged == true
    msg := sprintf("container %q runs privileged", [c.name])
}
```

Input with `web` (nginx:latest, memory limit set) and `sidecar` (envoy:1.30, no limits) yields:
`["container \"sidecar\" has no memory limit", "container \"web\" uses the :latest tag"]`.
Gatekeeper wraps the same logic in a `violation` rule inside a ConstraintTemplate.

## Worked example: AI agent tool-call guardrail

The agent runtime sends each proposed tool call to OPA before execution. Fails closed: unknown agents or tools are denied.

```rego
package agent.tools

high_risk := {"send_email", "transfer_funds", "delete_record"}

default allow := false

allow if count(deny) == 0

deny contains "tool is not on this agent's allowlist" if {
    not input.tool.name in data.agents[input.agent.id].allowed_tools
}

deny contains "high-risk tool needs human approval" if {
    input.tool.name in high_risk
    not input.approval.granted
}

deny contains msg if {
    input.tool.name == "send_email"
    some r in input.tool.args.to
    not endswith(r, "@contoso.com")
    msg := sprintf("external recipient %s is blocked", [r])
}

deny contains "transfer exceeds per-call limit" if {
    input.tool.name == "transfer_funds"
    input.tool.args.amount > data.limits.max_transfer
}

decision := {"allow": allow, "reasons": deny}
```

Input:

```json
{"agent": {"id": "support-bot"},
 "tool": {"name": "send_email", "args": {"to": ["pat@contoso.com", "x@gmail.com"]}},
 "approval": {"granted": false}}
```

Result of `data.agent.tools.decision`:

```json
{"allow": false,
 "reasons": ["external recipient x@gmail.com is blocked", "high-risk tool needs human approval"]}
```

The `reasons` set doubles as feedback the agent can use to re-plan, or as the prompt shown to a human approver.

## Worked example: Terraform plan check

Run against `terraform show -json plan.out` with `conftest test plan.json -p terraform/`. Conftest fails on `deny` and prints `warn`.

```rego
package terraform.plan

deny contains msg if {
    some rc in input.resource_changes
    rc.type == "aws_s3_bucket_public_access_block"
    rc.change.after.block_public_acls == false
    msg := sprintf("%s allows public ACLs", [rc.address])
}

deny contains msg if {
    some rc in input.resource_changes
    "delete" in rc.change.actions
    rc.type in {"aws_db_instance", "aws_rds_cluster"}
    msg := sprintf("plan deletes database %s", [rc.address])
}

warn contains msg if {
    some rc in input.resource_changes
    rc.change.after.tags.owner == null
    msg := sprintf("%s has no owner tag", [rc.address])
}
```

## Gotchas

- Undefined is not false. With no `default` and no matching body, the query returns an empty result. Always set `default allow := false` for allow-style decisions.
- A reference to a missing field is undefined and silently fails that line. A typo like `input.user.rol` never errors; it never matches. Use tests and the Regal linter.
- Three kinds of equals: `:=` assigns a local (error if already bound); `==` compares known values; `=` unifies (binds unknowns so both sides match). Prefer `:=` and `==`; use `=` only for pattern matching.
- Body order does not matter; Rego reorders expressions for safety.
- `not` needs bound variables: bind `x` with `some` before `not data.users[x].banned`.
- Pre-OPA-1.0 examples omit `if` and `contains`. Modern Rego requires both; `opa fmt` can upgrade old files.

## Testing

```rego
package httpapi.authz_test

import data.httpapi.authz

test_admin_can_delete if {
    authz.allow with input as {
        "user": {"name": "zoe", "role": "admin"},
        "method": "DELETE", "path": ["reports", "r1"]
    }
}

test_owner_can_edit_own_report if {
    authz.allow with input as {
        "user": {"name": "alice", "role": "viewer"},
        "method": "PUT", "path": ["reports", "r1"]
    } with data.reports as {"r1": {"owner": "alice"}}
}

test_viewer_cannot_delete_others if {
    not authz.allow with input as {
        "user": {"name": "bob", "role": "viewer"},
        "method": "DELETE", "path": ["reports", "r1"]
    } with data.reports as {"r1": {"owner": "alice"}}
}
```

## Commands

```sh
opa eval -d policy.rego -d data.json -i input.json "data.httpapi.authz.allow"
opa test . -v
opa test . --coverage
opa fmt -w .
opa run --server policy.rego data.json
curl -X POST localhost:8181/v1/data/httpapi/authz/allow \
     -d '{"input": {"user": {"role": "admin"}, "method": "GET", "path": ["reports"]}}'
# {"result": true}
```

## Where Rego runs

- OPA as sidecar or daemon (REST API, bundles for policy and data)
- Gatekeeper for Kubernetes admission and audit
- Conftest for Kubernetes YAML, Terraform plans, Dockerfiles, CI configs in CI
- OPA-Envoy plugin for ext_authz at the proxy
- Embedded Go library, or policies compiled to WebAssembly
- AI agent tool-call gating, as in the guardrail example
- Microsoft Foundry Agent Controls (managed, public preview), described below

## Managed option: Microsoft Foundry Agent Controls (public preview)

Source: https://learn.microsoft.com/en-us/azure/foundry/agent-controls/overview (docs last updated 2026-11-17)

Agent Controls is a managed Microsoft Foundry service that defines, manages centrally and evaluates runtime policies on AI agent behavior. Policy decision logic is written in Rego. It is built on the open-source Agent Control Specification (ACS) and Agent Hooks: Agent Hooks decides when to check, ACS defines how policies are expressed and evaluated, Agent Controls hosts management and evaluation, and the agent runtime enforces the result.

| Agent Controls concept | Meaning | Equivalent in plain OPA |
|---|---|---|
| Manifest + Rego modules | JSON manifest binds an intervention point and a target to a Rego query; Rego holds the logic | Policy file plus the query you evaluate |
| Intervention point | agent_startup, input, pre_model_call, post_model_call, pre_tool_call, post_tool_call, output, agent_shutdown | Where the runtime calls OPA (the tool guardrail above is pre_tool_call) |
| Snapshot / target | Current agent event, and the part checked (e.g. tool_call.args) | `input` |
| Annotator | Azure AI Content Safety classifier or LLM judge that runs before Rego and adds an annotation | Extra facts in `input` or `data` |
| Verdict | allow, deny or transform, optionally with warnings or an approval request | Decision object from `allow` plus `deny contains` reasons |
| Evaluation receipt | Policies and versions evaluated, intervention point, evaluation ID | OPA decision logs |

Microsoft's example: the manifest binds `pre_tool_call` to the Rego query `data.refund_guard.verdict` and targets `tool_call.args`. A refund of 150 over the 100 limit returns deny; 75 returns allow. Illustrative Rego in that shape (not Microsoft's source):

```rego
package refund_guard

max_refund := 100

verdict := "deny" if input.amount > max_refund
else := "allow"
```

- The host enforces. Agent Controls does not run the agent, execute tools or sandbox the process, and cannot stop a path that bypasses the interception code.
- Keep authorization and authoritative business data in trusted application systems.
- Control plane: Azure Resource Manager (policy resources and reusable Rego modules). Data plane: evaluation API, selecting a policy by `policyId`.
- Preview: details may change. During preview, billing covers only the classifier and LLM usage that policy evaluation triggers.

## Cheat sheet

| Topic | Syntax |
|---|---|
| Skeleton | `package my.policy` · `import data.other.pkg` · `default allow := false` · `allow if { … }` |
| Complete rule | `r := v if { … }` |
| Set rule | `s contains v if { … }` |
| Object rule | `o[k] := v if { … }` |
| Function | `f(x) := y if { … }` |
| Exists | `some x in xs` · `some k, v in obj` |
| For all | `every x in xs { cond }` |
| Comprehension | `{x \| some x in xs; cond}` |
| Else chain | `level := "high" if input.score > 80 else := "med" if input.score > 50 else := "low"` |
| Built-ins | `count sum max min sort startswith endswith contains sprintf concat split lower regex.match time.now_ns json.unmarshal io.jwt.decode` |
| Test | `test_name if { rule with input as {…} with data.x as {…} }` · `opa test . -v` |

## Guidance for agents writing Rego

- Use Rego v1 syntax: `if` on every rule body, `contains` on partial set rules.
- Give every allow-style decision a `default` so it is never undefined.
- Collect violations with `deny contains msg if { … }` and return reasons alongside the boolean.
- Fail closed: deny when a required fact (agent, tool, owner) is missing from `data`.
- Write `opa test` cases for each allow path and at least one deny path, using `with input as` and `with data.x as`.
- Run `opa fmt`, `opa test` and Regal before proposing a policy.
