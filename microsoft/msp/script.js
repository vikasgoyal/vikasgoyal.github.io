const detailContent = {
    models: {
        tone: "input",
        kicker: "Input Layer",
        title: "Models",
        summary: "Foundation and specialized models power planning, generation, reasoning, and adaptation. This layer can expose multiple model families with tuning and routing strategies.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Microsoft Foundry Models overview",
                meta: "Model options, capabilities, and tuning strategies in Microsoft Foundry",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview"
            },
            {
                title: "Model Catalog",
                meta: "Browse and compare available models",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/model-catalog-overview"
            },
            {
                title: "Fine-Tuning Overview",
                meta: "Adapt supported models for domain tasks",
                href: "https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/fine-tuning-considerations"
            }
        ],
        capabilities: [
            "Model selection and routing",
            "Fine-tuning and safety configuration",
            "Latency, cost, and quality tradeoff control"
        ],
        uses: [
            "Switch between domain-specific models",
            "Tune a model for internal workflows",
            "Compare model quality across tasks"
        ]
    },
    tools: {
        tone: "input",
        kicker: "Input Layer",
        title: "Tools",
        summary: "Agents call external systems and internal services through tool contracts. This is the layer for enterprise actions, APIs, MCP servers, and machine-to-machine interactions.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Tool Catalog",
                meta: "Connect built-in, public, and private tools",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog"
            },
            {
                title: "MCP Tools",
                meta: "Use Model Context Protocol servers with agents",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol-sse"
            },
            {
                title: "Publish to Microsoft 365",
                meta: "Expose agents to downstream surfaces and workflows",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot"
            }
        ],
        capabilities: [
            "MCP and API integrations",
            "Transactional task execution",
            "Secure action boundaries and permissions"
        ],
        uses: [
            "Query SAP, CRM, or internal portals",
            "Trigger approval workflows",
            "Connect agents to operational systems"
        ]
    },
    knowledge: {
        tone: "input",
        kicker: "Input Layer",
        title: "Knowledge",
        summary: "Knowledge grounds the agent with enterprise context, indexed content, and domain memory. It reduces hallucination and improves answer usefulness.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Foundry IQ Overview",
                meta: "Ground agents on enterprise and web knowledge",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq"
            },
            {
                title: "Use Foundry IQ",
                meta: "Add a knowledge base to agent workflows",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/use-foundry-knowledge"
            },
            {
                title: "Relationship to Fabric IQ and Work IQ",
                meta: "Microsoft provides three IQ workloads that give agents access to different aspects of your organization",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq?tabs=portal#relationship-to-fabric-iq-and-work-iq"
            }
        ],
        capabilities: [
            "Retrieval over curated sources",
            "Semantic search and ranking",
            "Domain-specific context packaging"
        ],
        uses: [
            "Search manuals and policy documents",
            "Answer with source-backed context",
            "Build analyst copilots with enterprise memory"
        ]
    },
    data: {
        tone: "input",
        kicker: "Input Layer",
        title: "Data",
        summary: "Structured and unstructured data feeds operational intelligence into the system. This includes analytics, telemetry, generation pipelines, and downstream reporting.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Generate synthetic data",
                meta: "generate synthetic data in Microsoft Foundry for fine-tuning",
                href: "https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/data-generation"
            },
            {
                title: "SDK Overview",
                meta: "Build data-connected Foundry applications in code",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview"
            },
            {
                title: "Region Support",
                meta: "Check deployment availability before rollout",
                href: "https://learn.microsoft.com/en-us/azure/foundry/reference/region-support"
            }
        ],
        capabilities: [
            "Dataset access and shaping",
            "Generated insights and synthetic content",
            "Realtime and batch data support"
        ],
        uses: [
            "Drive dashboards from agent output",
            "Generate scenario data",
            "Blend analytics with conversational workflows"
        ]
    },
    memory: {
        tone: "input",
        kicker: "Input Layer",
        title: "Memory",
        summary: "Memory in Microsoft Foundry Agent Service is a managed long-term memory system that retains durable user knowledge across sessions so agents can personalize interactions over time.",
        linkLabel: "Microsoft Learn memory documentation",
        links: [
            {
                title: "Memory Overview",
                meta: "Core concepts for long-term memory, memory types, security, and limits",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory?tabs=conversational-agent"
            },
            {
                title: "Create and Use Memory",
                meta: "Set up memory stores and use memory through tools or APIs",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage"
            },
            {
                title: "Limits and Regions",
                meta: "Check supported models, quotas, and regional availability for memory",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions"
            }
        ],
        capabilities: [
            "Extraction, consolidation, and retrieval of durable memories from conversations",
            "User profile memory for stable preferences and chat summary memory for prior conversation threads",
            "Memory search tools and low-level memory store APIs for different integration styles"
        ],
        uses: [
            "Recall user preferences such as name, language, or dietary restrictions across sessions",
            "Resume prior conversations without forcing users to repeat earlier context",
            "Personalize support, shopping, planning, or research agents with persistent user-specific context"
        ]
    },
    agents: {
        tone: "core",
        kicker: "Core Runtime",
        title: "Agents",
        summary: "Agents sit at the center of the platform, combining model intelligence, tools, knowledge, and state. They can specialize by role and cooperate to solve broader workflows.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "What is Microsoft Foundry",
                meta: "Platform entry point for multi-agent applications",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            },
            {
                title: "Quickstart",
                meta: "Create Foundry resources and start building",
                href: "https://learn.microsoft.com/en-us/azure/foundry/tutorials/quickstart-create-foundry-resources"
            },
            {
                title: "SDK Client Libraries",
                meta: "Develop agents with Python, C#, JS/TS, or Java",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview"
            }
        ],
        capabilities: [
            "Planning, reasoning, and delegation",
            "Tool and knowledge orchestration",
            "Role-specific behavior and policy control"
        ],
        uses: [
            "Analyst, operator, or support agents",
            "Agent teams for complex workflows",
            "Task-specific assistants with enterprise guardrails"
        ]
    },
    workflows: {
        tone: "execution",
        kicker: "Execution",
        title: "Workflows",
        summary: "Workflows in Microsoft Foundry are visual, declarative orchestration flows that combine agents, logic, variables, and human interaction into repeatable business processes without requiring custom code for every step.",
        linkLabel: "Microsoft Learn workflow documentation",
        links: [
            {
                title: "Workflow Concepts",
                meta: "Workflow builder concepts, orchestration patterns, nodes, and Power Fx guidance",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow"
            },
            {
                title: "Low-Code Workflows in VS Code",
                meta: "Edit declarative agent workflows in Visual Studio Code",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/vs-code-agents-workflow-low-code"
            },
            {
                title: "Hosted Workflows in VS Code",
                meta: "Work with pro-code hosted workflows and local playground support",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/vs-code-agents-workflow-pro-code"
            }
        ],
        capabilities: [
            "Built-in workflow patterns for sequential flows, group chat handoffs, and human-in-the-loop approvals or clarifying questions",
            "Composable nodes for agent invocation, logic branches, data transformation, and chat interactions",
            "Power Fx expressions, variables, YAML-backed editing, and versioned saves for repeatable automation design"
        ],
        uses: [
            "Create repeatable multi-agent business processes with branching logic and saved outputs",
            "Build approval flows or user clarification steps directly into agent execution",
            "Model step-by-step pipelines that mix agent actions, variable handling, and structured JSON outputs"
        ]
    },
    orchestration: {
        tone: "execution",
        kicker: "Execution",
        title: "Orchestration",
        summary: "Orchestration coordinates many agents, tools, and services. It controls handoffs, ordering, concurrency, and escalation across a larger system.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Workflow Concepts",
                meta: "Core orchestration model for collaborating agents",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow"
            },
            {
                title: "Publish Agents",
                meta: "Push orchestrated agents into Microsoft 365 and Teams",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot"
            },
            {
                title: "Microsoft Foundry API",
                meta: "Use the platform API for agentic app orchestration",
                href: "https://learn.microsoft.com/en-us/rest/api/aifoundry/"
            }
        ],
        capabilities: [
            "Agent handoff and role routing",
            "Parallel and sequential task coordination",
            "Failure handling and fallback logic"
        ],
        uses: [
            "Supervisor agent patterns",
            "Cross-team process coordination",
            "Complex multi-agent decisioning"
        ]
    },
    evaluations: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Evaluations",
        summary: "Agent evaluators in Microsoft Foundry act like workflow-focused tests, measuring both end-to-end task outcomes and the quality of each tool-driven step so teams can improve agent behavior with evidence.",
        linkLabel: "Microsoft Learn evaluator documentation",
        links: [
            {
                title: "Agent Evaluators",
                meta: "System and process evaluators, tool support, mappings, and example outputs",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators"
            },
            {
                title: "Run Cloud Evaluation",
                meta: "Execute evaluation jobs and configure datasets or generated responses as inputs",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/cloud-evaluation"
            },
            {
                title: "Agent Evaluator Samples",
                meta: "Reference implementations for task completion, tool quality, and navigation efficiency",
                href: "https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/ai/azure-ai-projects/samples/evaluations/agentic_evaluators"
            }
        ],
        capabilities: [
            "System evaluators for task completion, task adherence, intent resolution, navigation efficiency, and RAG quality on final responses",
            "Process evaluators for tool call accuracy, tool selection, input accuracy, output utilization, and tool call success",
            "Pass or fail results with reasoning, thresholds, and data mappings over agent message sequences and tool definitions"
        ],
        uses: [
            "Compare agent versions before release by testing both outcome quality and workflow execution quality",
            "Catch regressions in tool usage, parameter quality, or intent handling during iterative agent development",
            "Validate supported tool-based agents while avoiding evaluator combinations with currently limited tool support"
        ]
    },
    traces: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Traces",
        summary: "Agent tracing in Microsoft Foundry captures the full request journey across inputs, outputs, tool usage, retries, and latency so teams can inspect how an agent run unfolded step by step.",
        linkLabel: "Microsoft Learn tracing documentation",
        links: [
            {
                title: "Agent Tracing Overview",
                meta: "Trace concepts, OpenTelemetry model, multi-agent observability, and best practices",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
            },
            {
                title: "Set Up Tracing",
                meta: "Enable tracing end to end with a Foundry project and Application Insights",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup"
            },
            {
                title: "Tracing Integrations",
                meta: "Connect tracing across supported frameworks and multi-agent runtimes",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-framework"
            }
        ],
        capabilities: [
            "OpenTelemetry-based traces made of spans, attributes, events, and semantic conventions",
            "Visibility into user inputs, agent outputs, tool calls, tool results, and timing signals stored in Application Insights",
            "Multi-agent observability conventions for planning, orchestration, memory, tool arguments, and tool results"
        ],
        uses: [
            "Identify where an error, retry, or latency spike was introduced in a complex agent run",
            "Inspect nested tool activity and agent-to-agent handoffs with a consistent trace structure",
            "Correlate trace data with evaluation runs while redacting sensitive content from telemetry"
        ]
    },
    monitoring: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Monitoring",
        summary: "The Agent Monitoring Dashboard in Microsoft Foundry surfaces operational metrics, evaluation results, and red-teaming signals for agent traffic using telemetry from a connected Application Insights resource.",
        linkLabel: "Microsoft Learn monitoring documentation",
        links: [
            {
                title: "Monitor Agents Dashboard",
                meta: "Portal workflow, dashboard metrics, settings, and troubleshooting guidance",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard?tabs=python"
            },
            {
                title: "Set Up Tracing",
                meta: "Connect Application Insights so the dashboard can read agent telemetry",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup"
            },
            {
                title: "Agent Tracing Overview",
                meta: "Understand the telemetry model behind monitoring and diagnostics",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
            }
        ],
        capabilities: [
            "Summary cards and time-range charts for token usage, latency, run success rate, evaluator scores, and red-team results",
            "Monitor settings for continuous evaluation, scheduled evaluations, red team scans, and alerts",
            "Application Insights-backed observability with RBAC and Log Analytics access requirements for deeper views"
        ],
        uses: [
            "Spot latency spikes, failed runs, and unusually high token usage before they impact production users",
            "Verify continuous evaluation rules are producing scores and reports for sampled agent responses",
            "Troubleshoot empty charts, authorization issues, or missing evaluation results from the dashboard"
        ]
    },
    guardrails: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Guardrails",
        summary: "Microsoft Foundry guardrails are named collections of controls that detect risk, choose where to intervene, and decide whether to annotate or block content across models and agents.",
        linkLabel: "Microsoft Learn guardrails documentation",
        links: [
            {
                title: "Guardrails Overview",
                meta: "Core concepts for controls, risks, intervention points, and override behavior",
                href: "https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview"
            },
            {
                title: "Intervention Points and Controls",
                meta: "Understand user input, tool call, tool response, and output scanning",
                href: "https://learn.microsoft.com/en-us/azure/foundry/guardrails/intervention-points"
            },
            {
                title: "Configure Guardrails and Controls",
                meta: "Create and assign guardrails for models and agents in a project",
                href: "https://learn.microsoft.com/en-us/azure/foundry/guardrails/how-to-create-guardrails"
            }
        ],
        capabilities: [
            "Risk controls for hate, sexual, self-harm, violence, jailbreaks, indirect attacks, protected material, and selected preview risks",
            "Scanning at user input and output, plus tool call and tool response intervention points for agents in preview",
            "Severity thresholds and override behavior so an agent guardrail can fully replace the underlying model guardrail"
        ],
        uses: [
            "Apply one named guardrail across multiple model deployments and agents in a project",
            "Tune blocking strictness with Low, Medium, or High severity thresholds by risk category",
            "Troubleshoot why content was blocked or why tool-call traffic was not scanned"
        ]
    },
    compliance: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Compliance",
        summary: "Azure OpenAI applies default guardrail policies across supported text, vision, image, and audio models so prompts and completions are filtered against core harm categories before production use.",
        linkLabel: "Microsoft Learn safety policy documentation",
        links: [
            {
                title: "Default Guardrail Policies",
                meta: "Baseline safety coverage, thresholds, and model-specific policy tables",
                href: "https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/default-safety-policies?tabs=gpt-image-1%2Cwarning"
            },
            {
                title: "Configure Custom Safety Policies",
                meta: "Adjust guardrail behavior beyond the default configuration",
                href: "https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/content-filters"
            },
            {
                title: "Content Credentials",
                meta: "Understand provenance support for generated image content",
                href: "https://learn.microsoft.com/en-us/azure/foundry-classic/openai/concepts/content-credentials"
            }
        ],
        capabilities: [
            "Default filtering for hate, violence, sexual, and self-harm content at Medium severity",
            "Additional protections for jailbreaks, protected material, public figures, profanity, and sensitive attribute scenarios depending on model type",
            "Blocked requests return category-aware filtering responses for both prompts and model outputs"
        ],
        uses: [
            "Explain baseline safety posture during security and risk reviews",
            "Validate text, vision, image, and audio workloads against the built-in policy set",
            "Test deployments with known trigger prompts before enabling production traffic"
        ]
    },
    agent365: {
        tone: "ecosystem",
        kicker: "Control Plane",
        title: "Agent 365",
        summary: "Agent 365 is the control plane for agents, extending familiar enterprise infrastructure so teams can confidently deploy, manage, and secure agentic AI across the organization.",
        linkLabel: "Microsoft product and resource pages",
        links: [
            {
                title: "Agent 365 Home",
                meta: "Product overview, capabilities, and early access information",
                href: "https://www.microsoft.com/en-us/microsoft-agent-365"
            },
            {
                title: "Microsoft Entra Agent ID",
                meta: "Identity and access capabilities purpose-built for agents",
                href: "https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-agent-id"
            },
            {
                title: "Microsoft 365 Copilot",
                meta: "Deploy agents into secure work experiences across Microsoft 365",
                href: "https://www.microsoft.com/en-us/microsoft-365-copilot"
            }
        ],
        capabilities: [
            "Central agent registry across Entra agent ID, registered, and shadow agents",
            "Enterprise access control, security posture, and governance for agentic AI",
            "Integration with Microsoft 365, Defender, Entra, Purview, and Power Platform"
        ],
        uses: [
            "Give IT admins a single place to discover and organize agents",
            "Extend existing user controls and protections to agent identities and actions",
            "Deploy and govern agents across productivity, analytics, and business workflows"
        ]
    }
};

const phaseMap = {
    models: ["prepare"],
    tools: ["prepare"],
    knowledge: ["prepare"],
    data: ["prepare"],
    memory: ["prepare"],
    agents: ["build"],
    workflows: ["build"],
    orchestration: ["build"],
    "multi-agent": ["build"],
    evaluations: ["govern"],
    traces: ["govern"],
    monitoring: ["govern"],
    guardrails: ["govern"],
    compliance: ["govern"],
    agent365: ["manage"]
};

const panel = document.getElementById("detail-panel");
const detailCard = panel.querySelector(".detail-card");
const closeButton = document.getElementById("detail-close");
const title = document.getElementById("detail-title");
const kicker = document.getElementById("detail-kicker");
const summary = document.getElementById("detail-summary");
const links = document.getElementById("detail-links");
const linksLabel = document.getElementById("detail-links-label");
const capabilities = document.getElementById("detail-capabilities");
const uses = document.getElementById("detail-uses");
const triggers = document.querySelectorAll("[data-detail]");
const phaseControlledElements = document.querySelectorAll("[data-phase-key]");
const diagram = document.querySelector(".diagram");
const phaseToggles = document.querySelectorAll("[data-phase-toggle]");
const newsButton = document.getElementById("open-news");
const newsPanel = document.getElementById("news-panel");
const newsCloseButton = document.getElementById("news-close");
const newsStatus = document.getElementById("news-status");
const newsList = document.getElementById("news-list");

let activeTrigger = null;
let openMode = null;
let newsItems = [];
let newsRequest = null;

const currentScriptUrl = document.currentScript?.src || window.location.href;
const localNewsDataUrl = new URL("news.json", currentScriptUrl).href;
const allowRemoteNewsFetch = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
const newsFeedUrl = "https://devblogs.microsoft.com/foundry/feed/";
const newsCategoryLookupUrl = "https://devblogs.microsoft.com/foundry/wp-json/wp/v2/categories?search=What's%20New";
const newsPostsApiBaseUrl = "https://devblogs.microsoft.com/foundry/wp-json/wp/v2/posts?per_page=8&_fields=date,link,title,excerpt";

function getActivePhases() {
    return Array.from(phaseToggles)
        .filter((toggle) => toggle.checked)
        .map((toggle) => toggle.value);
}

function matchesActivePhase(element, activePhases) {
    if (activePhases.length === 0) {
        return false;
    }

    const phaseKey = element.dataset.detail || element.dataset.phaseKey;
    const blockPhases = phaseMap[phaseKey] || [];
    return blockPhases.some((phase) => activePhases.includes(phase));
}

function applyPhaseFilter() {
    const activePhases = getActivePhases();

    triggers.forEach((trigger) => {
        const isMatch = matchesActivePhase(trigger, activePhases);
        trigger.classList.toggle("is-phase-dimmed", !isMatch);

        if (!isMatch && activeTrigger === trigger) {
            closePanel();
        }
    });

    phaseControlledElements.forEach((element) => {
        if (element.dataset.detail) {
            return;
        }

        const isMatch = matchesActivePhase(element, activePhases);
        element.classList.toggle("is-phase-dimmed", !isMatch);
    });
}

function clearActiveState() {
    triggers.forEach((trigger) => {
        trigger.classList.remove("is-active-detail");
        trigger.setAttribute("aria-expanded", "false");
    });
    diagram.classList.remove("has-active-panel");
}

function renderList(container, items) {
    container.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderLinks(items) {
    links.innerHTML = items
        .map(
            (item) => `
                <a class="detail-link-card" href="${item.href}" target="_blank" rel="noreferrer noopener">
                    <span class="detail-link-title">${item.title}</span>
                    <span class="detail-link-meta">${item.meta}</span>
                </a>
            `
        )
        .join("");
}

function openPanel(key, trigger, mode) {
    const content = detailContent[key];
    if (!content) {
        return;
    }

    kicker.textContent = content.kicker;
    title.textContent = content.title;
    summary.textContent = content.summary;
    linksLabel.textContent = content.linkLabel || "Microsoft Learn documentation";
    renderLinks(content.links || []);
    renderList(capabilities, content.capabilities);
    renderList(uses, content.uses);
    detailCard.className = `detail-card tone-${content.tone}`;
    clearActiveState();
    trigger.classList.add("is-active-detail");
    trigger.setAttribute("aria-expanded", "true");
    diagram.classList.add("has-active-panel");
    panel.hidden = false;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    activeTrigger = trigger;
    openMode = mode;
}

function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    clearActiveState();
    window.setTimeout(() => {
        if (!panel.classList.contains("is-open")) {
            panel.hidden = true;
        }
    }, 180);
    if (activeTrigger) {
        activeTrigger.blur();
        activeTrigger = null;
    }
    openMode = null;
}

function decodeMarkup(value) {
    const doc = new DOMParser().parseFromString(value || "", "text/html");
    return doc.body.textContent.replace(/\s+/g, " ").trim();
}

function formatFeedDate(value) {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Recent";
    }

    return parsedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function parseFeedItems(xmlText) {
    const xml = new DOMParser().parseFromString(xmlText, "application/xml");
    const parserError = xml.querySelector("parsererror");

    if (parserError) {
        throw new Error("The Microsoft Foundry feed could not be parsed.");
    }

    return Array.from(xml.querySelectorAll("item"))
        .map((item) => {
            const itemTitle = decodeMarkup(item.querySelector("title")?.textContent || "Untitled update");
            const itemLink = item.querySelector("link")?.textContent?.trim() || newsFeedUrl;
            const itemDate = item.querySelector("pubDate")?.textContent?.trim() || "";
            const itemDescription = decodeMarkup(item.querySelector("description")?.textContent || "")
                .replace(/The post .*? appeared first on .*$/i, "")
                .trim();

            return {
                title: itemTitle,
                link: itemLink,
                dateLabel: formatFeedDate(itemDate),
                summary: itemDescription || "Open the post for the full update."
            };
        })
        .filter((item) => item.title && item.link)
        .slice(0, 8);
}

function parseWordPressPosts(posts) {
    return posts
        .map((post) => ({
            title: decodeMarkup(post.title?.rendered || "Untitled update"),
            link: (post.link || newsFeedUrl).trim(),
            dateLabel: formatFeedDate(post.date || ""),
            summary: decodeMarkup(post.excerpt?.rendered || "") || "Open the post for the full update."
        }))
        .filter((item) => item.title && item.link)
        .slice(0, 8);
}

function normalizeSnapshotItems(items) {
    return (Array.isArray(items) ? items : [])
        .map((item) => ({
            title: decodeMarkup(item.title || "Untitled update"),
            link: (item.link || newsFeedUrl).trim(),
            dateLabel: item.dateLabel || formatFeedDate(item.date || ""),
            summary: decodeMarkup(item.summary || "") || "Open the post for the full update."
        }))
        .filter((item) => item.title && item.link)
        .slice(0, 8);
}

async function loadNewsFromLocalSnapshot() {
    const snapshotResponse = await fetch(localNewsDataUrl, {
        cache: "no-store"
    });

    if (!snapshotResponse.ok) {
        throw new Error("The local news snapshot is unavailable.");
    }

    const snapshot = await snapshotResponse.json();
    const items = normalizeSnapshotItems(snapshot.items || snapshot);

    if (items.length === 0) {
        throw new Error("The local news snapshot is empty.");
    }

    return items;
}

async function loadNewsFromWordPressApi() {
    let categoryId = "";

    try {
        const categoryResponse = await fetch(newsCategoryLookupUrl);

        if (categoryResponse.ok) {
            const categories = await categoryResponse.json();
            categoryId = categories[0]?.id ? `&categories=${categories[0].id}` : "";
        }
    } catch {
        categoryId = "";
    }

    const postsResponse = await fetch(`${newsPostsApiBaseUrl}${categoryId}`);

    if (!postsResponse.ok) {
        throw new Error("The Microsoft Foundry blog is unavailable right now.");
    }

    const posts = await postsResponse.json();
    return parseWordPressPosts(posts);
}

function renderNewsItems(items) {
    newsList.innerHTML = items
        .map(
            (item) => `
                <article class="news-item">
                    <div class="news-item-header">
                        <h3 class="news-item-title">${item.title}</h3>
                        <span class="news-item-date">${item.dateLabel}</span>
                    </div>
                    <p>${item.summary}</p>
                    <a class="news-item-link" href="${item.link}" target="_blank" rel="noreferrer noopener">Read article</a>
                </article>
            `
        )
        .join("");
}

async function loadNewsFeed() {
    if (newsItems.length > 0) {
        return newsItems;
    }

    if (!newsRequest) {
        newsRequest = loadNewsFromLocalSnapshot()
            .catch((error) => {
                if (!allowRemoteNewsFetch) {
                    throw error;
                }

                return fetch(newsFeedUrl)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("The Microsoft Foundry feed is unavailable right now.");
                        }

                        return response.text();
                    })
                    .then((xmlText) => parseFeedItems(xmlText))
                    .catch(() => loadNewsFromWordPressApi());
            })
            .then((items) => {
                newsItems = items;
                return newsItems;
            })
            .finally(() => {
                newsRequest = null;
            });
    }

    return newsRequest;
}

function openNewsPanel() {
    closePanel();
    newsPanel.hidden = false;
    newsPanel.classList.add("is-open");
    newsPanel.setAttribute("aria-hidden", "false");
    newsButton.setAttribute("aria-expanded", "true");

    if (newsItems.length > 0) {
        newsStatus.textContent = `Showing ${newsItems.length} recent posts from the Microsoft Foundry blog.`;
        renderNewsItems(newsItems);
        return;
    }

    newsStatus.textContent = "Loading latest posts from the Microsoft Foundry feed...";
    newsList.innerHTML = "";

    loadNewsFeed()
        .then((items) => {
            newsStatus.textContent = `Showing ${items.length} recent posts from the Microsoft Foundry blog.`;
            renderNewsItems(items);
        })
        .catch((error) => {
            newsStatus.textContent = error.message || "Unable to load the feed right now.";
            newsList.innerHTML = `
                <article class="news-item">
                    <div class="news-item-header">
                        <h3 class="news-item-title">Feed unavailable</h3>
                    </div>
                    <p>Open the RSS feed directly to check the latest Microsoft Foundry updates.</p>
                    <a class="news-item-link" href="${newsFeedUrl}" target="_blank" rel="noreferrer noopener">Open feed</a>
                </article>
            `;
        });
}

function closeNewsPanel() {
    newsPanel.classList.remove("is-open");
    newsPanel.setAttribute("aria-hidden", "true");
    newsButton.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
        if (!newsPanel.classList.contains("is-open")) {
            newsPanel.hidden = true;
        }
    }, 180);
}

triggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => {
        if (activeTrigger === trigger && openMode === "click") {
            closePanel();
            return;
        }

        openPanel(trigger.dataset.detail, trigger, "click");
    });
});

phaseToggles.forEach((toggle) => {
    toggle.addEventListener("change", applyPhaseFilter);
});

panel.addEventListener("click", (event) => {
    if (event.target === panel) {
        closePanel();
    }
});

closeButton.addEventListener("click", closePanel);
newsButton.addEventListener("click", openNewsPanel);
newsCloseButton.addEventListener("click", closeNewsPanel);

newsPanel.addEventListener("click", (event) => {
    if (event.target === newsPanel) {
        closeNewsPanel();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePanel();
        closeNewsPanel();
    }
});

applyPhaseFilter();