import React, { useEffect, useMemo, useState } from "react";

export default function TasksDemo() {
    // اگر بک‌اند روی پورت دیگه‌ست، مثلاً:
    // const API_BASE = "http://localhost:3000/api";
    const API_BASE = "/api";

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Create form
    const [newTitle, setNewTitle] = useState("");
    const [newDone, setNewDone] = useState(false);

    // Get by id
    const [getId, setGetId] = useState("");
    const [singleTask, setSingleTask] = useState(null);

    // Patch
    const [patchId, setPatchId] = useState("");
    const [patchTitle, setPatchTitle] = useState("");
    const [patchDone, setPatchDone] = useState(""); // "", "true", "false" برای اینکه optional بودنش رو تست کنیم

    // Delete
    const [deleteId, setDeleteId] = useState("");

    // UI filters (کلاینتی) برای نمایش بهتر
    const [showDone, setShowDone] = useState("all"); // all | done | todo
    const [search, setSearch] = useState("");

    // Debug panel
    const [lastResponse, setLastResponse] = useState(null);
    const [lastError, setLastError] = useState(null);

    async function request(path, options = {}) {
        setLastError(null);

        const res = await fetch(`${API_BASE}${path}`, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...options,
        });

        const text = await res.text();
        let json = null;
        try {
            json = text ? JSON.parse(text) : null;
        } catch {
            json = { raw: text };
        }

        if (!res.ok) {
            const err = {
                status: res.status,
                statusText: res.statusText,
                body: json,
            };
            throw err;
        }

        return json;
    }

    async function loadTasks() {
        setLoading(true);
        try {
            const data = await request("/tasks");
            setTasks(Array.isArray(data) ? data : []);
            setLastResponse({ ok: true, endpoint: "GET /tasks", data });
        } catch (e) {
            setLastError({ endpoint: "GET /tasks", error: e });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTasks = useMemo(() => {
        let list = [...tasks];

        if (showDone === "done") list = list.filter((t) => t.done === true);
        if (showDone === "todo") list = list.filter((t) => t.done === false);

        const q = search.trim().toLowerCase();
        if (q)
            list = list.filter((t) =>
                String(t.title || "")
                    .toLowerCase()
                    .includes(q)
            );

        return list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }, [tasks, showDone, search]);

    async function handleCreate(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                data: {
                    title: newTitle,
                    done: newDone,
                },
            };
            const data = await request("/tasks", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setLastResponse({ ok: true, endpoint: "POST /tasks", data });

            setNewTitle("");
            setNewDone(false);
            await loadTasks();
        } catch (e2) {
            setLastError({ endpoint: "POST /tasks", error: e2 });
        } finally {
            setLoading(false);
        }
    }

    async function handleGetById(e) {
        e.preventDefault();
        setLoading(true);
        setSingleTask(null);
        try {
            const id = String(getId).trim();
            const data = await request(`/tasks/${encodeURIComponent(id)}`);
            setSingleTask(data?.task ?? null);
            setLastResponse({ ok: true, endpoint: "GET /tasks/:id", data });
        } catch (e2) {
            setLastError({ endpoint: "GET /tasks/:id", error: e2 });
        } finally {
            setLoading(false);
        }
    }

    async function handlePatch(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const id = String(patchId).trim();

            // PATCH: فقط فیلدهایی که واقعاً می‌خوای تغییر بدی رو بفرست
            const dataObj = {};
            if (patchTitle !== "") dataObj.title = patchTitle; // اگر خواستی title خالی رو هم تست کنی، این شرط رو بردار
            if (patchDone !== "") dataObj.done = patchDone === "true";

            const payload = { data: dataObj };

            const data = await request(`/tasks/${encodeURIComponent(id)}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            setLastResponse({ ok: true, endpoint: "PATCH /tasks/:id", data });
            setPatchTitle("");
            setPatchDone("");
            await loadTasks();
        } catch (e2) {
            setLastError({ endpoint: "PATCH /tasks/:id", error: e2 });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const id = String(deleteId).trim();
            const data = await request(`/tasks/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            setLastResponse({ ok: true, endpoint: "DELETE /tasks/:id", data });
            setDeleteId("");
            await loadTasks();
        } catch (e2) {
            setLastError({ endpoint: "DELETE /tasks/:id", error: e2 });
        } finally {
            setLoading(false);
        }
    }

    function formatTime(ts) {
        if (!ts) return "-";
        try {
            return new Date(ts).toLocaleString();
        } catch {
            return String(ts);
        }
    }

    const boxStyle = {
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 14,
        background: "white",
    };

    const labelStyle = {
        display: "block",
        fontSize: 12,
        opacity: 0.8,
        marginBottom: 6,
    };

    return (
        <div
            style={{
                fontFamily: "system-ui, sans-serif",
                padding: 18,
                maxWidth: 1100,
                margin: "0 auto",
            }}
        >
            <h2 style={{ margin: 0 }}>Tasks API Playground</h2>
            <p style={{ marginTop: 6, opacity: 0.75 }}>
                این کامپوننت مستقیم به بک‌اندت می‌زنه و خروجی/ارورها رو هم نشون
                می‌ده.
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                }}
            >
                {/* Left: List & Filters */}
                <div style={boxStyle}>
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <strong>لیست تسک‌ها</strong>{" "}
                            <span style={{ fontSize: 12, opacity: 0.7 }}>
                                ({filteredTasks.length} / {tasks.length})
                            </span>
                        </div>
                        <button
                            onClick={loadTasks}
                            disabled={loading}
                            style={{ padding: "8px 10px" }}
                        >
                            Refresh
                        </button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ minWidth: 180 }}>
                            <span style={labelStyle}>Filter</span>
                            <select
                                value={showDone}
                                onChange={(e) => setShowDone(e.target.value)}
                                style={{ width: "100%", padding: 8 }}
                            >
                                <option value="all">All</option>
                                <option value="done">Done</option>
                                <option value="todo">Todo</option>
                            </select>
                        </div>

                        <div style={{ flex: 1, minWidth: 220 }}>
                            <span style={labelStyle}>
                                Search title (client-side)
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="مثلاً learn..."
                                style={{ width: "100%", padding: 8 }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: 12,
                            maxHeight: 380,
                            overflow: "auto",
                            borderTop: "1px solid #eee",
                            paddingTop: 10,
                        }}
                    >
                        {loading && tasks.length === 0 ? (
                            <div style={{ opacity: 0.7 }}>Loading...</div>
                        ) : filteredTasks.length === 0 ? (
                            <div style={{ opacity: 0.7 }}>هیچ تسکی نیست.</div>
                        ) : (
                            filteredTasks.map((t) => (
                                <div
                                    key={t.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 10,
                                        padding: "10px 10px",
                                        border: "1px solid #eee",
                                        borderRadius: 10,
                                        marginBottom: 8,
                                        background: "#fafafa",
                                    }}
                                >
                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 10,
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 999,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#fff",
                                                    border: "1px solid #e5e5e5",
                                                    fontSize: 12,
                                                }}
                                                title="id"
                                            >
                                                {t.id}
                                            </span>
                                            <strong
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {t.title}
                                            </strong>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    opacity: 0.75,
                                                }}
                                            >
                                                {t.done ? "✅ done" : "⬜ todo"}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                opacity: 0.7,
                                                marginTop: 6,
                                            }}
                                        >
                                            createdAt: {formatTime(t.createdAt)}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setGetId(String(t.id));
                                                setPatchId(String(t.id));
                                                setDeleteId(String(t.id));
                                            }}
                                            style={{ padding: "7px 9px" }}
                                            title="Fill forms with this id"
                                        >
                                            Use id
                                        </button>
                                        <button
                                            onClick={async () => {
                                                // Quick toggle via PATCH
                                                setLoading(true);
                                                try {
                                                    const data = await request(
                                                        `/tasks/${t.id}`,
                                                        {
                                                            method: "PATCH",
                                                            body: JSON.stringify(
                                                                {
                                                                    data: {
                                                                        done: !t.done,
                                                                    },
                                                                }
                                                            ),
                                                        }
                                                    );
                                                    setLastResponse({
                                                        ok: true,
                                                        endpoint:
                                                            "PATCH /tasks/:id (toggle)",
                                                        data,
                                                    });
                                                    await loadTasks();
                                                } catch (e2) {
                                                    setLastError({
                                                        endpoint:
                                                            "PATCH /tasks/:id (toggle)",
                                                        error: e2,
                                                    });
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                            style={{ padding: "7px 9px" }}
                                        >
                                            Toggle
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Forms */}
                <div style={{ display: "grid", gap: 14 }}>
                    {/* Create */}
                    <div style={boxStyle}>
                        <strong>POST /tasks</strong>
                        <form
                            onSubmit={handleCreate}
                            style={{ marginTop: 10, display: "grid", gap: 10 }}
                        >
                            <div>
                                <span style={labelStyle}>title</span>
                                <input
                                    value={newTitle}
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                    placeholder="مثلاً Learn Express"
                                    style={{ width: "100%", padding: 8 }}
                                />
                            </div>
                            <label
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={newDone}
                                    onChange={(e) =>
                                        setNewDone(e.target.checked)
                                    }
                                />
                                done
                            </label>
                            <button
                                disabled={loading}
                                style={{ padding: "10px 12px" }}
                            >
                                Create
                            </button>
                        </form>
                    </div>

                    {/* Get by id */}
                    <div style={boxStyle}>
                        <strong>GET /tasks/:id</strong>
                        <form
                            onSubmit={handleGetById}
                            style={{ marginTop: 10, display: "flex", gap: 10 }}
                        >
                            <input
                                value={getId}
                                onChange={(e) => setGetId(e.target.value)}
                                placeholder="id"
                                style={{ flex: 1, padding: 8 }}
                            />
                            <button
                                disabled={loading}
                                style={{ padding: "10px 12px" }}
                            >
                                Fetch
                            </button>
                        </form>

                        <div style={{ marginTop: 10, fontSize: 13 }}>
                            {singleTask ? (
                                <div
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 10,
                                        padding: 10,
                                        background: "#fafafa",
                                    }}
                                >
                                    <div>
                                        <strong>id:</strong> {singleTask.id}
                                    </div>
                                    <div>
                                        <strong>title:</strong>{" "}
                                        {singleTask.title}
                                    </div>
                                    <div>
                                        <strong>done:</strong>{" "}
                                        {String(singleTask.done)}
                                    </div>
                                    <div>
                                        <strong>createdAt:</strong>{" "}
                                        {formatTime(singleTask.createdAt)}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ opacity: 0.7 }}>
                                    هنوز چیزی نگرفتی.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patch */}
                    <div style={boxStyle}>
                        <strong>PATCH /tasks/:id</strong>
                        <form
                            onSubmit={handlePatch}
                            style={{ marginTop: 10, display: "grid", gap: 10 }}
                        >
                            <div>
                                <span style={labelStyle}>id</span>
                                <input
                                    value={patchId}
                                    onChange={(e) => setPatchId(e.target.value)}
                                    placeholder="id"
                                    style={{ width: "100%", padding: 8 }}
                                />
                            </div>

                            <div>
                                <span style={labelStyle}>title (اختیاری)</span>
                                <input
                                    value={patchTitle}
                                    onChange={(e) =>
                                        setPatchTitle(e.target.value)
                                    }
                                    placeholder="اگر خالی بذاری ارسال نمیشه"
                                    style={{ width: "100%", padding: 8 }}
                                />
                            </div>

                            <div>
                                <span style={labelStyle}>done (اختیاری)</span>
                                <select
                                    value={patchDone}
                                    onChange={(e) =>
                                        setPatchDone(e.target.value)
                                    }
                                    style={{ width: "100%", padding: 8 }}
                                >
                                    <option value="">(don’t send)</option>
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </select>
                            </div>

                            <button
                                disabled={loading}
                                style={{ padding: "10px 12px" }}
                            >
                                Patch
                            </button>

                            <div style={{ fontSize: 12, opacity: 0.75 }}>
                                نکته: اگر هیچ فیلدی نفرستی (data خالی)، باید از
                                Zod پیام خطا بگیری.
                            </div>
                        </form>
                    </div>

                    {/* Delete */}
                    <div style={boxStyle}>
                        <strong>DELETE /tasks/:id</strong>
                        <form
                            onSubmit={handleDelete}
                            style={{ marginTop: 10, display: "flex", gap: 10 }}
                        >
                            <input
                                value={deleteId}
                                onChange={(e) => setDeleteId(e.target.value)}
                                placeholder="id"
                                style={{ flex: 1, padding: 8 }}
                            />
                            <button
                                disabled={loading}
                                style={{ padding: "10px 12px" }}
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Debug */}
            <div style={{ ...boxStyle, marginTop: 14 }}>
                <strong>Debug</strong>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginTop: 10,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 12,
                                opacity: 0.75,
                                marginBottom: 6,
                            }}
                        >
                            Last response
                        </div>
                        <pre
                            style={{
                                margin: 0,
                                padding: 10,
                                background: "#0b1020",
                                color: "white",
                                borderRadius: 10,
                                overflow: "auto",
                            }}
                        >
                            {lastResponse
                                ? JSON.stringify(lastResponse, null, 2)
                                : "—"}
                        </pre>
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 12,
                                opacity: 0.75,
                                marginBottom: 6,
                            }}
                        >
                            Last error
                        </div>
                        <pre
                            style={{
                                margin: 0,
                                padding: 10,
                                background: "#200b0b",
                                color: "white",
                                borderRadius: 10,
                                overflow: "auto",
                            }}
                        >
                            {lastError
                                ? JSON.stringify(lastError, null, 2)
                                : "—"}
                        </pre>
                    </div>
                </div>
            </div>

            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
                اگر CORS/Origin مشکل داشت، API_BASE رو به آدرس کامل بک‌اند تغییر
                بده و CORS_ORIGIN رو هم درست ست کن.
            </div>
        </div>
    );
}
