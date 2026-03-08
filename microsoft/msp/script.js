const detailContent = {
    models: {
        tone: "input",
        kicker: "Input Layer",
        title: "Models",
        summary: "Foundation and specialized models power planning, generation, reasoning, and adaptation. This layer can expose multiple model families with tuning and routing strategies.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "What is Microsoft Foundry",
                meta: "Platform overview and core concepts",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            },
            {
                title: "Model Catalog",
                meta: "Browse and compare available models",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/model-catalog-overview"
            },
            {
                title: "Fine-Tuning Overview",
                meta: "Adapt supported models for domain tasks",
                href: "https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/fine-tuning"
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
                title: "What is Microsoft Foundry",
                meta: "See knowledge integration in the platform context",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
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
                title: "What is Microsoft Foundry",
                meta: "Platform context for data-backed agent systems",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
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
        summary: "Memory stores user, session, and system context so agents can behave consistently across interactions and collaborate across time.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Memory Overview",
                meta: "How agent memory works in Microsoft Foundry",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory"
            },
            {
                title: "What is Microsoft Foundry",
                meta: "See enhanced memory capabilities in the platform overview",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            },
            {
                title: "Workflow Concepts",
                meta: "Use memory inside longer-running agent workflows",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow"
            }
        ],
        capabilities: [
            "Session and long-term memory",
            "Preference and state persistence",
            "Cross-agent context sharing"
        ],
        uses: [
            "Recall prior user preferences",
            "Resume multi-step business tasks",
            "Maintain context across agent handoffs"
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
        summary: "Workflows define repeatable business processes around agents, including approvals, checkpoints, retries, and human review stages.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Workflow Concepts",
                meta: "Multi-agent orchestration and workflow patterns",
                href: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow"
            },
            {
                title: "AI Templates",
                meta: "Start from a packaged application pattern",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/ai-template-get-started"
            },
            {
                title: "Create a Project",
                meta: "Set up the project container for execution workflows",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/create-projects"
            }
        ],
        capabilities: [
            "Stateful multi-step execution",
            "Rules, triggers, and checkpoints",
            "Human-in-the-loop review paths"
        ],
        uses: [
            "Incident triage pipelines",
            "Claims or case handling journeys",
            "Automated intake and fulfillment flows"
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
        summary: "Evaluation frameworks score quality, reliability, and policy adherence so teams can improve prompts, tools, and models based on evidence.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Continuous Evaluation",
                meta: "Set up evaluation in the observability dashboard",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard#set-up-continuous-evaluation"
            },
            {
                title: "What is Microsoft Foundry",
                meta: "See real-time observability in the platform overview",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            },
            {
                title: "What's New",
                meta: "Track evaluation and governance feature updates",
                href: "https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry"
            }
        ],
        capabilities: [
            "Benchmarking and regression testing",
            "Task-specific scoring rubrics",
            "Release gates for prompt and model changes"
        ],
        uses: [
            "Track answer quality over time",
            "Compare agent versions before release",
            "Detect regressions after model changes"
        ]
    },
    traces: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Traces",
        summary: "Traces capture what an agent did, why it acted, which tools it called, and how long each step took. They are essential for debugging and auditing.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Monitor Agents Dashboard",
                meta: "Observability entry point for trace and runtime insight",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard"
            },
            {
                title: "Microsoft Foundry API",
                meta: "Platform APIs for deeper operational integration",
                href: "https://learn.microsoft.com/en-us/rest/api/aifoundry/"
            },
            {
                title: "What's New",
                meta: "Stay current on tracing and monitoring updates",
                href: "https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry"
            }
        ],
        capabilities: [
            "Step-by-step execution visibility",
            "Tool call and prompt inspection",
            "Latency and dependency analysis"
        ],
        uses: [
            "Root-cause failed agent actions",
            "Inspect multi-agent handoffs",
            "Audit how a response was produced"
        ]
    },
    monitoring: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Monitoring",
        summary: "Monitoring tracks health, latency, cost, and user outcomes in production. It closes the loop between platform design and real-world usage.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Monitor Agents Dashboard",
                meta: "Production health, latency, and governance views",
                href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard"
            },
            {
                title: "Manage Costs",
                meta: "Plan and control operational spend",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs"
            },
            {
                title: "Region Support",
                meta: "Monitor with region-aware deployment planning",
                href: "https://learn.microsoft.com/en-us/azure/foundry/reference/region-support"
            }
        ],
        capabilities: [
            "Health and reliability telemetry",
            "Cost and throughput tracking",
            "Alerting on degraded behavior"
        ],
        uses: [
            "Watch production agent fleets",
            "Control operational spend",
            "Identify quality drift early"
        ]
    },
    guardrails: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Guardrails",
        summary: "Guardrails define safe boundaries for behavior, content, access, and action. They reduce unsafe outcomes without over-restricting useful automation.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "Disable Preview Features with RBAC",
                meta: "Use role-based controls to lock down production experiences",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/disable-preview-features-with-rbac"
            },
            {
                title: "Hide Preview Features with Azure Tags",
                meta: "Suppress preview features at the portal level",
                href: "https://learn.microsoft.com/en-us/azure/foundry/how-to/disable-preview-features"
            },
            {
                title: "What is Microsoft Foundry",
                meta: "Overview of enterprise support and policy controls",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            }
        ],
        capabilities: [
            "Policy filters and moderation",
            "Access control and action limits",
            "Prompt and tool safety enforcement"
        ],
        uses: [
            "Block sensitive actions without approval",
            "Filter unsafe or disallowed content",
            "Enforce environment-specific policies"
        ]
    },
    compliance: {
        tone: "control",
        kicker: "Operational Controls",
        title: "Compliance",
        summary: "Compliance capabilities align the system with legal, governance, and enterprise audit requirements. This is where operational trust becomes enterprise-ready.",
        linkLabel: "Microsoft Learn documentation",
        links: [
            {
                title: "What is Microsoft Foundry",
                meta: "Enterprise-ready platform overview",
                href: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
            },
            {
                title: "Disable Preview Features with RBAC",
                meta: "Tighten operational posture for controlled environments",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/disable-preview-features-with-rbac"
            },
            {
                title: "Manage Costs",
                meta: "Operational governance for usage and billing visibility",
                href: "https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs"
            }
        ],
        capabilities: [
            "Policy evidence and audit readiness",
            "Regional and sector controls",
            "Retention and reporting strategies"
        ],
        uses: [
            "Prepare internal audit reviews",
            "Map platform behavior to policy controls",
            "Support regulated business deployments"
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
    models: ["prepare", "build"],
    tools: ["prepare", "build"],
    knowledge: ["prepare", "build"],
    data: ["prepare", "build"],
    memory: ["prepare", "build"],
    agents: ["build", "manage"],
    workflows: ["build"],
    orchestration: ["build", "manage"],
    "multi-agent": ["build", "manage"],
    evaluations: ["govern"],
    traces: ["govern", "manage"],
    monitoring: ["govern", "manage"],
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