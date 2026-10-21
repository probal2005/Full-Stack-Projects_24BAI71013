(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);

    const form = $("eventForm");
    const contentInput = $("postContent");
    const failureToggle = $("simulateFailure");
    const failureWarning = $("failureWarning");
    const publishButton = $("publishButton");
    const refreshButton = $("refreshButton");
    const activityRefresh = $("activityRefresh");
    const statusFilter = $("statusFilter");
    const eventsTable = $("eventsTable");

    let allEvents = [];
    let refreshInProgress = false;

    const statElements = {
        totalEvents: $("totalEvents"),
        processed: $("processed"),
        retries: $("retries"),
        deadLetter: $("deadLetter")
    };

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function field(object, name) {
        if (!object) return undefined;
        if (object[name] !== undefined) return object[name];

        const match = Object.keys(object).find(
            key => key.toLowerCase() === name.toLowerCase()
        );

        return match ? object[match] : undefined;
    }

    function number(value) {
        const parsed = Number(value ?? 0);
        return Number.isFinite(parsed) ? parsed.toLocaleString() : "0";
    }

    function formatTime(value) {
        if (!value) return "—";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

        return date.toLocaleString([], {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    function normalizeStatus(value) {
        return String(value ?? "UNKNOWN").trim().toUpperCase();
    }

    function statusClass(status) {
        switch (normalizeStatus(status)) {
            case "PROCESSED": return "badge-processed";
            case "PUBLISHED": return "badge-published";
            case "RETRYING": return "badge-retrying";
            case "DLQ": return "badge-dlq";
            case "FAILED": return "badge-failed";
            case "DUPLICATE": return "badge-duplicate";
            default: return "badge-unknown";
        }
    }

    function showToast(title, message, type = "success") {
        const container = $("toastContainer");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;

        const heading = document.createElement("strong");
        heading.textContent = title;

        const body = document.createElement("span");
        body.textContent = message;

        toast.append(heading, body);
        container.appendChild(toast);

        window.setTimeout(() => toast.remove(), 5500);
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const text = await response.text();
        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { message: text };
        }

        if (!response.ok) {
            throw new Error(
                data.error || data.message ||
                `Request failed with HTTP ${response.status}`
            );
        }

        return data;
    }

    function renderStats(stats) {
        Object.entries(statElements).forEach(([key, element]) => {
            element.textContent = number(stats[key]);
        });
    }

    function renderEvents(events) {
        const filter = statusFilter.value;
        const filtered = filter === "ALL"
            ? events
            : events.filter(event =>
                normalizeStatus(field(event, "status")) === filter
            );

        $("eventCount").textContent =
            `${filtered.length} event log${filtered.length === 1 ? "" : "s"} shown`;

        if (filtered.length === 0) {
            eventsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        No events found for this filter. Publish an event to get started.
                    </td>
                </tr>`;
            return;
        }

        eventsTable.innerHTML = filtered.map(event => {
            const id = field(event, "event_id") ?? "Unknown";
            const status = normalizeStatus(field(event, "status"));
            const message = field(event, "message") ?? "—";
            const attempts = field(event, "attempt_count") ?? 0;
            const createdAt = field(event, "created_at");

            return `
                <tr>
                    <td>
                        <div class="event-id" title="${escapeHtml(id)}">
                            ${escapeHtml(String(id).slice(0, 13))}
                        </div>
                        <div class="event-type">
                            ${escapeHtml(field(event, "event_type") ?? "SCHEDULED_POST")}
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass(status)}">
                            ${escapeHtml(status)}
                        </span>
                    </td>
                    <td class="message-cell" title="${escapeHtml(message)}">
                        ${escapeHtml(message)}
                    </td>
                    <td class="attempt-count">${escapeHtml(attempts)}</td>
                    <td class="time-cell">${escapeHtml(formatTime(createdAt))}</td>
                    <td>
                        <button
                            class="icon-button copy-event"
                            type="button"
                            data-event-id="${escapeHtml(id)}"
                            title="Copy event ID"
                            aria-label="Copy event ID">⧉</button>
                    </td>
                </tr>`;
        }).join("");
    }

    async function refreshDashboard() {
        if (refreshInProgress) return;

        refreshInProgress = true;
        refreshButton.disabled = true;
        activityRefresh.disabled = true;

        try {
            const [health, data] = await Promise.all([
                request("/api/health"),
                request("/api/events?limit=50")
            ]);

            $("systemStatus").textContent =
                health.status === "UP" ? "API connected" : "API warning";

            renderStats(data.stats || {});
            allEvents = Array.isArray(data.events) ? data.events : [];
            renderEvents(allEvents);
            $("lastUpdated").textContent =
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
        } catch (error) {
            $("systemStatus").textContent = "Connection unavailable";
            console.error("Dashboard refresh failed:", error);
        } finally {
            refreshInProgress = false;
            refreshButton.disabled = false;
            activityRefresh.disabled = false;
        }
    }

    contentInput.addEventListener("input", () => {
        $("characterCount").textContent =
            `${contentInput.value.length} / 2000`;
    });

    failureToggle.addEventListener("change", () => {
        failureWarning.hidden = !failureToggle.checked;
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const content = contentInput.value.trim();

        if (!content) {
            showToast("Content required", "Enter some post content first.", "error");
            contentInput.focus();
            return;
        }

        publishButton.disabled = true;
        publishButton.innerHTML = "<span>Publishing event...</span>";

        const scheduledValue = $("scheduledAt").value;

        const payload = {
            content,
            scheduledAt: scheduledValue || null,
            simulateFailure: failureToggle.checked
        };

        try {
            const result = await request("/api/events", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            showToast(
                "Event submitted",
                `Event ${result.eventId} was accepted for Kafka publication.`
            );

            form.reset();
            $("characterCount").textContent = "0 / 2000";
            failureWarning.hidden = true;

            await refreshDashboard();
        } catch (error) {
            showToast("Publication failed", error.message, "error");
        } finally {
            publishButton.disabled = false;
            publishButton.innerHTML =
                '<span>Publish to Kafka</span><span class="button-arrow">→</span>';
        }
    });

    eventsTable.addEventListener("click", async (event) => {
        const button = event.target.closest(".copy-event");
        if (!button) return;

        const id = button.dataset.eventId;

        try {
            await navigator.clipboard.writeText(id);
            showToast("Copied", "Event ID copied to clipboard.");
        } catch {
            showToast("Copy unavailable", `Event ID: ${id}`, "error");
        }
    });

    statusFilter.addEventListener("change", () => renderEvents(allEvents));
    refreshButton.addEventListener("click", refreshDashboard);
    activityRefresh.addEventListener("click", refreshDashboard);

    refreshDashboard();
    window.setInterval(refreshDashboard, 3000);
})();
