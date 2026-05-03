import { useEffect, useMemo, useState } from "react";
import Section from "../components/Section";
import {
    isCloudConfigured,
    loadBudgetEntriesFromStorage,
    saveBudgetEntriesToStorage,
} from "../services/budgetCloudStorage";

const CATEGORY_OPTIONS = ["Income", "Savings", "Expenses"];
const CATEGORY_COLOR = {
    Income: "#3a86ff",
    Savings: "#06d6a0",
    Expenses: "#ff6b6b",
};
const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

function formatCurrency(value) {
    return value.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });
}

function normalizeEntries(source) {
    if (!Array.isArray(source)) {
        return [];
    }

    return source
        .filter((item) => (
            item
            && typeof item.id === "string"
            && CATEGORY_OPTIONS.includes(item.category)
            && Number.isFinite(Number(item.amount))
            && Number.isInteger(item.year)
            && Number.isInteger(item.month)
            && item.month >= 1
            && item.month <= 12
        ))
        .map((item) => ({
            ...item,
            amount: Number(item.amount),
        }));
}

function buildConicGradient(data, total) {
    let cursor = 0;

    const stops = data.map((item) => {
        const portion = total === 0 ? 0 : (item.value / total) * 100;
        const start = cursor;
        const end = cursor + portion;
        cursor = end;
        return `${item.color} ${start}% ${end}%`;
    });

    return `conic-gradient(${stops.join(", ")})`;
}

function summarize(entries) {
    const totals = {
        Income: 0,
        Savings: 0,
        Expenses: 0,
    };

    entries.forEach((item) => {
        totals[item.category] += Number(item.amount);
    });

    return [
        { label: "Income", value: totals.Income, color: CATEGORY_COLOR.Income },
        { label: "Savings", value: totals.Savings, color: CATEGORY_COLOR.Savings },
        { label: "Expenses", value: totals.Expenses, color: CATEGORY_COLOR.Expenses },
    ];
}

function csvEscape(value) {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderPiePngDataUrl(data, total, title) {
    const size = 420;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return "";
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 150;
    const innerRadius = 78;

    if (total <= 0) {
        ctx.beginPath();
        ctx.fillStyle = "#e5e7eb";
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    } else {
        let start = -Math.PI / 2;
        data.forEach((item) => {
            const angle = (item.value / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.fillStyle = item.color;
            ctx.arc(centerX, centerY, radius, start, start + angle);
            ctx.closePath();
            ctx.fill();
            start += angle;
        });
    }

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.font = "600 18px Arial";
    ctx.fillText(title, centerX, centerY - 14);
    ctx.font = "700 20px Arial";
    ctx.fillText(formatCurrency(total), centerX, centerY + 16);

    return canvas.toDataURL("image/png");
}

function downloadDoc(fileName, html) {
    const blob = new Blob([`\ufeff${html}`], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadCSV(fileName, rows) {
    const content = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function BudgetPieCard({ title, subtitle, data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const pieBackground = buildConicGradient(data, total);

    return (
        <article className="budgetCard">
            <header className="budgetCardHead">
                <h3 className="h3">{title}</h3>
                <p className="muted">{subtitle}</p>
            </header>

            <div className="budgetChartRow">
                <div
                    className="budgetPie"
                    style={{ background: pieBackground }}
                    role="img"
                    aria-label={`${title} pie chart for income, savings and expenses`}
                >
                    <div className="budgetPieCenter">
                        <div className="small muted">Total</div>
                        <div className="budgetTotal">{formatCurrency(total)}</div>
                    </div>
                </div>

                <ul className="budgetLegend" aria-label={`${title} breakdown`}>
                    {data.map((item) => {
                        const percent = total === 0 ? 0 : Math.round((item.value / total) * 100);

                        return (
                            <li className="budgetLegendItem" key={item.label}>
                                <span className="budgetSwatch" style={{ background: item.color }} aria-hidden="true" />
                                <div className="budgetLegendContent">
                                    <div className="budgetLegendTop">
                                        <strong className="strongish">{item.label}</strong>
                                        <span className="budgetPercent">{percent}%</span>
                                    </div>
                                    <div className="muted">{formatCurrency(item.value)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </article>
    );
}

export default function Budget() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const [entries, setEntries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [storageMessage, setStorageMessage] = useState(
        isCloudConfigured()
            ? "Trying to connect Google Drive..."
            : "Google Drive client is missing. Add REACT_APP_GOOGLE_CLIENT_ID in env."
    );
    const [formData, setFormData] = useState({
        category: "Expenses",
        amount: "",
        note: "",
    });

    useEffect(() => {
        let alive = true;

        async function loadEntries() {
            const result = await loadBudgetEntriesFromStorage();
            if (!alive) {
                return;
            }

            const normalized = normalizeEntries(result.entries);
            setEntries(normalized);
            setStorageMessage(
                result.warning
                    || (result.source === "cloud"
                        ? "Google Drive sync active. Data is shared across browsers/devices."
                        : "Using local browser storage only.")
            );
            setIsLoading(false);
        }

        loadEntries();

        return () => {
            alive = false;
        };
    }, []);

    const yearOptions = useMemo(() => {
        const years = new Set([currentYear, currentYear - 1, currentYear + 1]);
        entries.forEach((item) => years.add(item.year));
        return [...years].sort((a, b) => b - a);
    }, [entries, currentYear]);

    const monthlyEntries = useMemo(
        () => entries
            .filter((item) => item.year === selectedYear && item.month === selectedMonth)
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
        [entries, selectedMonth, selectedYear]
    );

    const yearlyEntries = useMemo(
        () => entries.filter((item) => item.year === selectedYear),
        [entries, selectedYear]
    );

    const monthlySummary = useMemo(() => summarize(monthlyEntries), [monthlyEntries]);
    const yearlySummary = useMemo(() => summarize(yearlyEntries), [yearlyEntries]);

    async function persist(nextEntries) {
        const normalized = normalizeEntries(nextEntries);
        setEntries(normalized);
        setIsSaving(true);

        const result = await saveBudgetEntriesToStorage(normalized);
        setStorageMessage(
            result.warning
                || (result.source === "cloud"
                    ? "Google Drive sync active. Data is shared across browsers/devices."
                    : "Using local browser storage only.")
        );
        setIsSaving(false);
    }

    async function handleAddEntry(event) {
        event.preventDefault();
        const amount = Number(formData.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return;
        }

        const entry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            category: formData.category,
            amount,
            note: formData.note.trim(),
            month: selectedMonth,
            year: selectedYear,
            createdAt: new Date().toISOString(),
        };

        const nextEntries = [...entries, entry];
        await persist(nextEntries);
        setFormData((prev) => ({ ...prev, amount: "", note: "" }));
    }

    async function handleDeleteEntry(id) {
        const nextEntries = entries.filter((item) => item.id !== id);
        await persist(nextEntries);
    }

    function exportMonthlyCSV() {
        const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
        const rows = [
            ["Report", "Monthly Budget"],
            ["Month", monthLabel],
            ["Year", selectedYear],
            [],
            ["Date", "Category", "Amount", "Note"],
            ...monthlyEntries.map((item) => [
                item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "",
                item.category,
                item.amount,
                item.note,
            ]),
            [],
            ["Category", "Total"],
            ...monthlySummary.map((item) => [item.label, item.value]),
        ];

        downloadCSV(`budget-${selectedYear}-${String(selectedMonth).padStart(2, "0")}.csv`, rows);
    }

    function exportYearlyCSV() {
        const rows = [
            ["Report", "Yearly Budget"],
            ["Year", selectedYear],
            [],
            ["Date", "Month", "Category", "Amount", "Note"],
            ...yearlyEntries.map((item) => [
                item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "",
                MONTHS.find((m) => m.value === item.month)?.label || item.month,
                item.category,
                item.amount,
                item.note,
            ]),
            [],
            ["Category", "Total"],
            ...yearlySummary.map((item) => [item.label, item.value]),
        ];

        downloadCSV(`budget-${selectedYear}-yearly.csv`, rows);
    }

    function exportDocReport() {
        const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
        const monthlyTotal = monthlySummary.reduce((sum, item) => sum + item.value, 0);
        const yearlyTotal = yearlySummary.reduce((sum, item) => sum + item.value, 0);
        const monthlyChart = renderPiePngDataUrl(monthlySummary, monthlyTotal, `Monthly - ${monthLabel}`);
        const yearlyChart = renderPiePngDataUrl(yearlySummary, yearlyTotal, `Yearly - ${selectedYear}`);

        const monthlyRowsHtml = monthlySummary.map((item) => `
            <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(formatCurrency(item.value))}</td>
            </tr>
        `).join("");

        const yearlyRowsHtml = yearlySummary.map((item) => `
            <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(formatCurrency(item.value))}</td>
            </tr>
        `).join("");

        const entryRowsHtml = monthlyEntries.map((item) => `
            <tr>
                <td>${escapeHtml(item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "-")}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(formatCurrency(item.amount))}</td>
                <td>${escapeHtml(item.note || "-")}</td>
            </tr>
        `).join("");

        const html = `
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Budget Report</title>
                </head>
                <body style="font-family: Arial, sans-serif; color: #111;">
                    <h1>Personal Budget Report</h1>
                    <p><strong>Selected Month:</strong> ${escapeHtml(monthLabel)} ${escapeHtml(selectedYear)}</p>
                    <p><strong>Generated On:</strong> ${escapeHtml(new Date().toLocaleString("en-IN"))}</p>

                    <h2>Monthly Pie Chart</h2>
                    <img src="${monthlyChart}" alt="Monthly pie chart" style="width:320px;height:320px;" />
                    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; margin-top: 12px;">
                        <tr><th>Category</th><th>Total</th></tr>
                        ${monthlyRowsHtml}
                    </table>

                    <h2 style="margin-top: 24px;">Yearly Pie Chart</h2>
                    <img src="${yearlyChart}" alt="Yearly pie chart" style="width:320px;height:320px;" />
                    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; margin-top: 12px;">
                        <tr><th>Category</th><th>Total</th></tr>
                        ${yearlyRowsHtml}
                    </table>

                    <h2 style="margin-top: 24px;">Monthly Entries</h2>
                    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
                        <tr><th>Date</th><th>Category</th><th>Amount</th><th>Note</th></tr>
                        ${entryRowsHtml || "<tr><td colspan=\"4\">No entries for selected month.</td></tr>"}
                    </table>
                </body>
            </html>
        `;

        downloadDoc(`budget-${selectedYear}-${String(selectedMonth).padStart(2, "0")}-report.doc`, html);
    }


    const selectedMonthLabel = MONTHS.find((item) => item.value === selectedMonth)?.label;

    return (
        <div className="stack">
            <Section
                title="Personal Budget"
                subtitle="Track entries, visualize monthly/yearly split, and export reports"
            >
                <p className="budgetStorageNote muted">{storageMessage}</p>

                <div className="budgetControls">
                    <div className="budgetControlGroup">
                        <label className="budgetLabel" htmlFor="budget-month">Month</label>
                        <select
                            id="budget-month"
                            className="budgetInput"
                            value={selectedMonth}
                            onChange={(event) => setSelectedMonth(Number(event.target.value))}
                        >
                            {MONTHS.map((month) => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="budgetControlGroup">
                        <label className="budgetLabel" htmlFor="budget-year">Year</label>
                        <select
                            id="budget-year"
                            className="budgetInput"
                            value={selectedYear}
                            onChange={(event) => setSelectedYear(Number(event.target.value))}
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="budgetActions">
                        <button type="button" className="btn ghost" onClick={exportMonthlyCSV}>
                            Export Monthly CSV
                        </button>
                        <button type="button" className="btn ghost" onClick={exportYearlyCSV}>
                            Export Yearly CSV
                        </button>
                        <button type="button" className="btn ghost" onClick={exportDocReport}>
                            Export DOC Report
                        </button>
                    </div>
                </div>

                <form className="budgetForm" onSubmit={handleAddEntry}>
                    <div className="budgetControlGroup">
                        <label className="budgetLabel" htmlFor="entry-category">Category</label>
                        <select
                            id="entry-category"
                            className="budgetInput"
                            value={formData.category}
                            onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                            disabled={isLoading || isSaving}
                        >
                            {CATEGORY_OPTIONS.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="budgetControlGroup">
                        <label className="budgetLabel" htmlFor="entry-amount">Amount</label>
                        <input
                            id="entry-amount"
                            className="budgetInput"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(event) => setFormData((prev) => ({ ...prev, amount: event.target.value }))}
                            disabled={isLoading || isSaving}
                            required
                        />
                    </div>

                    <div className="budgetControlGroup budgetControlGrow">
                        <label className="budgetLabel" htmlFor="entry-note">Note</label>
                        <input
                            id="entry-note"
                            className="budgetInput"
                            type="text"
                            maxLength={120}
                            placeholder="Optional note"
                            value={formData.note}
                            onChange={(event) => setFormData((prev) => ({ ...prev, note: event.target.value }))}
                            disabled={isLoading || isSaving}
                        />
                    </div>

                    <button type="submit" className="btn" disabled={isLoading || isSaving}>
                        {isSaving ? "Saving..." : "Add Entry"}
                    </button>
                </form>

                <div className="budgetGrid">
                    <BudgetPieCard
                        title={`Monthly Budget (${selectedMonthLabel} ${selectedYear})`}
                        subtitle="Income, savings and expenses for selected month"
                        data={monthlySummary}
                    />
                    <BudgetPieCard
                        title={`Yearly Budget (${selectedYear})`}
                        subtitle="Income, savings and expenses across the selected year"
                        data={yearlySummary}
                    />
                </div>

                <div className="budgetTableWrap">
                    <div className="cardTop">
                        <h3 className="h3">Entries for {selectedMonthLabel} {selectedYear}</h3>
                        <span className="pill">{monthlyEntries.length} records</span>
                    </div>

                    <div className="budgetTableScroll">
                        <table className="budgetTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Note</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="budgetEmpty">No entries yet for this month.</td>
                                    </tr>
                                ) : monthlyEntries.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "-"}</td>
                                        <td>
                                            <span className="pill" style={{ color: CATEGORY_COLOR[item.category] }}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(item.amount)}</td>
                                        <td>{item.note || "-"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn ghost budgetDeleteBtn"
                                                onClick={() => handleDeleteEntry(item.id)}
                                                disabled={isLoading || isSaving}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>
        </div>
    );
}
