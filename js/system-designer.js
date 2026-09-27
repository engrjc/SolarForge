// ========================================
// SolarForge Visual System Designer
// Port-to-port wiring foundation
// ========================================

const SolarForgeDesigner = {
    components: [],
    connections: [],
    selectedId: null,
    pendingPort: null,
    tool: "select",
    zoom: 1,
    nextId: 1,
    history: [],
    future: []
};

const MATERIALS = [
    {
        type: "pv",
        name: "Solar Panel",
        model: "550W Monocrystalline",
        power: 550,
        image: "",
        fields: { "Power": "550 W", "Voc": "49.8 V", "Vmp": "41.5 V", "Isc": "14.2 A" },
        ports: [
            { key: "positive", label: "+", side: "right", kind: "dc-positive" },
            { key: "negative", label: "−", side: "right", kind: "dc-negative" }
        ]
    },
    {
        type: "inverter",
        name: "Hybrid Inverter",
        model: "5kW / 48V Hybrid Inverter",
        power: 5000,
        image: "",
        fields: { "Rated Power": "5,000 W", "Battery": "48 V", "Max PV": "6,500 W", "MPPT": "2" },
        ports: [
            { key: "pv-positive", label: "PV+", side: "left-top", kind: "dc-positive" },
            { key: "pv-negative", label: "PV−", side: "left-bottom", kind: "dc-negative" },
            { key: "battery-positive", label: "BAT+", side: "bottom-left", kind: "battery-positive" },
            { key: "battery-negative", label: "BAT−", side: "bottom-right", kind: "battery-negative" },
            { key: "ac-line", label: "AC-L", side: "right-top", kind: "ac-line" },
            { key: "ac-neutral", label: "AC-N", side: "right-bottom", kind: "ac-neutral" },
            { key: "ground", label: "PE", side: "bottom-center", kind: "ground" }
        ]
    },
    {
        type: "battery",
        name: "Battery",
        model: "48V 100Ah LiFePO4",
        power: 4800,
        image: "",
        fields: { "Nominal": "48 V", "Capacity": "100 Ah", "Energy": "4.8 kWh", "Chemistry": "LiFePO4" },
        ports: [
            { key: "positive", label: "+", side: "top-left", kind: "battery-positive" },
            { key: "negative", label: "−", side: "top-right", kind: "battery-negative" }
        ]
    },
    {
        type: "protection",
        name: "DC Isolator",
        model: "1000V / 32A DC Isolator",
        power: 0,
        image: "",
        fields: { "Voltage": "1000 VDC", "Current": "32 A", "Poles": "2P" },
        ports: [
            { key: "in-positive", label: "IN+", side: "left-top", kind: "dc-positive" },
            { key: "in-negative", label: "IN−", side: "left-bottom", kind: "dc-negative" },
            { key: "out-positive", label: "OUT+", side: "right-top", kind: "dc-positive" },
            { key: "out-negative", label: "OUT−", side: "right-bottom", kind: "dc-negative" }
        ]
    },
    {
        type: "protection",
        name: "DC SPD",
        model: "PV DC SPD Type 2",
        power: 0,
        image: "",
        fields: { "Voltage": "600 VDC", "Type": "Type 2", "Poles": "2P" },
        ports: [
            { key: "in-positive", label: "IN+", side: "left-top", kind: "dc-positive" },
            { key: "in-negative", label: "IN−", side: "left-bottom", kind: "dc-negative" },
            { key: "out-positive", label: "OUT+", side: "right-top", kind: "dc-positive" },
            { key: "out-negative", label: "OUT−", side: "right-bottom", kind: "dc-negative" },
            { key: "ground", label: "PE", side: "bottom-center", kind: "ground" }
        ]
    },
    {
        type: "protection",
        name: "AC Breaker",
        model: "2P 32A AC Breaker",
        power: 0,
        image: "",
        fields: { "Voltage": "240 VAC", "Current": "32 A", "Poles": "2P" },
        ports: [
            { key: "in-line", label: "IN-L", side: "left-top", kind: "ac-line" },
            { key: "in-neutral", label: "IN-N", side: "left-bottom", kind: "ac-neutral" },
            { key: "out-line", label: "OUT-L", side: "right-top", kind: "ac-line" },
            { key: "out-neutral", label: "OUT-N", side: "right-bottom", kind: "ac-neutral" }
        ]
    },
    {
        type: "protection",
        name: "AC SPD",
        model: "AC SPD Type 2",
        power: 0,
        image: "",
        fields: { "Voltage": "275 VAC", "Type": "Type 2", "Poles": "2P" },
        ports: [
            { key: "in-line", label: "IN-L", side: "left-top", kind: "ac-line" },
            { key: "in-neutral", label: "IN-N", side: "left-bottom", kind: "ac-neutral" },
            { key: "out-line", label: "OUT-L", side: "right-top", kind: "ac-line" },
            { key: "out-neutral", label: "OUT-N", side: "right-bottom", kind: "ac-neutral" },
            { key: "ground", label: "PE", side: "bottom-center", kind: "ground" }
        ]
    },
    {
        type: "load",
        name: "AC Load",
        model: "Residential Loads",
        power: 2500,
        image: "",
        fields: { "Connected Load": "2,500 W", "Type": "AC Load" },
        ports: [
            { key: "line", label: "L", side: "left-top", kind: "ac-line" },
            { key: "neutral", label: "N", side: "left-bottom", kind: "ac-neutral" },
            { key: "ground", label: "PE", side: "left-center", kind: "ground" }
        ]
    }
];

const portCompatibility = {
    "dc-positive": ["dc-positive"],
    "dc-negative": ["dc-negative"],
    "battery-positive": ["battery-positive"],
    "battery-negative": ["battery-negative"],
    "ac-line": ["ac-line"],
    "ac-neutral": ["ac-neutral"],
    "ground": ["ground"]
};

const canvas = document.getElementById("designCanvas");
const componentLayer = document.getElementById("componentLayer");
const wireLayer = document.getElementById("wireLayer");
const materialList = document.getElementById("materialList");
const propertiesContent = document.getElementById("propertiesContent");
const toast = document.getElementById("toast");

function uid() {
    return "C" + (SolarForgeDesigner.nextId++);
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function saveHistory() {
    SolarForgeDesigner.history.push({
        components: clone(SolarForgeDesigner.components),
        connections: clone(SolarForgeDesigner.connections)
    });
    if (SolarForgeDesigner.history.length > 30) SolarForgeDesigner.history.shift();
    SolarForgeDesigner.future = [];
}

function showToast(message, type = "info") {
    toast.textContent = message;
    toast.className = "toast show " + type;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function materialImage(material) {
    if (material.image) {
        return `<img src="${material.image}" alt="${material.name}" onerror="this.style.display='none'">`;
    }
    const icons = {
        pv: "☀",
        inverter: "⚡",
        battery: "🔋",
        protection: "▣",
        load: "⌂"
    };
    return `<div class="fallback-image">${icons[material.type] || "◈"}</div>`;
}

function renderMaterials() {
    const query = document.getElementById("materialSearch").value.toLowerCase();
    const active = document.querySelector(".filter.active")?.dataset.filter || "all";

    materialList.innerHTML = "";

    MATERIALS
        .filter(m => active === "all" || m.type === active)
        .filter(m => (m.name + " " + m.model).toLowerCase().includes(query))
        .forEach(material => {
            const card = document.createElement("div");
            card.className = "material-card";
            card.innerHTML = `
                <div class="material-thumb">${materialImage(material)}</div>
                <div class="material-info">
                    <strong>${material.name}</strong>
                    <span>${material.model}</span>
                </div>
                <button class="add-material">Add</button>
            `;
            card.querySelector(".add-material").addEventListener("click", () => addComponent(material));
            materialList.appendChild(card);
        });
}

function addComponent(material) {
    saveHistory();

    const count = SolarForgeDesigner.components.length;
    const component = {
        id: uid(),
        materialType: material.type,
        name: material.name,
        model: material.model,
        power: material.power || 0,
        image: material.image || "",
        fields: clone(material.fields || {}),
        ports: clone(material.ports || []),
        x: 120 + ((count % 3) * 270),
        y: 90 + (Math.floor(count / 3) * 210)
    };

    SolarForgeDesigner.components.push(component);
    SolarForgeDesigner.selectedId = component.id;
    render();
    showToast(`${material.name} added to design`, "success");
}

function render() {
    renderComponents();
    renderWires();
    updateSummary();
    renderProperties();
}

function renderComponents() {
    componentLayer.innerHTML = "";

    SolarForgeDesigner.components.forEach(component => {
        const card = document.createElement("div");
        card.className = "component-card " + component.materialType;
        card.dataset.id = component.id;
        card.style.left = component.x + "px";
        card.style.top = component.y + "px";

        if (SolarForgeDesigner.selectedId === component.id) card.classList.add("selected");

        card.innerHTML = `
            <div class="component-header">
                <div class="component-icon">${materialImage({
                    type: component.materialType,
                    image: component.image,
                    name: component.name
                })}</div>
                <div>
                    <strong>${component.name}</strong>
                    <span>${component.model}</span>
                </div>
            </div>
            <div class="component-power">${component.power ? formatNumber(component.power) + " W" : "Protection / Connection"}</div>
            <div class="ports"></div>
        `;

        const ports = card.querySelector(".ports");

        component.ports.forEach(port => {
            const p = document.createElement("button");
            p.className = `port ${port.kind}`;
            p.dataset.component = component.id;
            p.dataset.port = port.key;
            p.title = `${port.label} — click to connect`;
            p.innerHTML = `<span></span><b>${port.label}</b>`;
            placePort(p, port.side);
            p.addEventListener("click", e => {
                e.stopPropagation();
                handlePortClick(component.id, port.key);
            });
            ports.appendChild(p);
        });

        card.addEventListener("click", e => {
            if (!e.target.closest(".port")) {
                SolarForgeDesigner.selectedId = component.id;
                render();
            }
        });

        enableDrag(card, component);
        componentLayer.appendChild(card);
    });
}

function placePort(el, side) {
    el.classList.add("port-" + side);
}

function enableDrag(card, component) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;

    card.addEventListener("pointerdown", e => {
        if (e.target.closest(".port") || SolarForgeDesigner.tool === "wire") return;

        dragging = true;
        card.setPointerCapture(e.pointerId);

        startX = e.clientX;
        startY = e.clientY;
        originX = component.x;
        originY = component.y;

        SolarForgeDesigner.selectedId = component.id;
        card.classList.add("dragging");
    });

    card.addEventListener("pointermove", e => {
        if (!dragging) return;

        const dx = (e.clientX - startX) / SolarForgeDesigner.zoom;
        const dy = (e.clientY - startY) / SolarForgeDesigner.zoom;

        component.x = Math.max(10, originX + dx);
        component.y = Math.max(10, originY + dy);

        card.style.left = component.x + "px";
        card.style.top = component.y + "px";
        renderWires();
    });

    card.addEventListener("pointerup", e => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove("dragging");
        saveHistory();
        updateSummary();
    });
}

function findComponent(id) {
    return SolarForgeDesigner.components.find(c => c.id === id);
}

function findPort(componentId, portKey) {
    const component = findComponent(componentId);
    return component?.ports.find(p => p.key === portKey);
}

function handlePortClick(componentId, portKey) {
    const component = findComponent(componentId);
    const port = findPort(componentId, portKey);
    if (!component || !port) return;

    if (!SolarForgeDesigner.pendingPort) {
        SolarForgeDesigner.pendingPort = { componentId, portKey };
        highlightPorts();
        showToast(`Selected ${component.name} ${port.label}. Choose a compatible port.`, "info");
        return;
    }

    const first = SolarForgeDesigner.pendingPort;

    if (first.componentId === componentId && first.portKey === portKey) {
        SolarForgeDesigner.pendingPort = null;
        highlightPorts();
        showToast("Connection cancelled", "info");
        return;
    }

    const firstPort = findPort(first.componentId, first.portKey);

    if (!isCompatible(firstPort, port)) {
        showToast(`Cannot connect ${firstPort.label} to ${port.label}. Use matching electrical ports.`, "error");
        return;
    }

    if (connectionExists(first.componentId, first.portKey, componentId, portKey)) {
        SolarForgeDesigner.pendingPort = null;
        highlightPorts();
        showToast("Those ports are already connected.", "error");
        return;
    }

    saveHistory();

    SolarForgeDesigner.connections.push({
        id: "W" + Date.now(),
        from: { componentId: first.componentId, portKey: first.portKey },
        to: { componentId, portKey },
        kind: firstPort.kind
    });

    SolarForgeDesigner.pendingPort = null;
    highlightPorts();
    renderWires();
    updateSummary();

    showToast("Connection created", "success");
}

function isCompatible(a, b) {
    return a && b &&
        (portCompatibility[a.kind] || []).includes(b.kind);
}

function connectionExists(a, ap, b, bp) {
    return SolarForgeDesigner.connections.some(w =>
        (w.from.componentId === a && w.from.portKey === ap && w.to.componentId === b && w.to.portKey === bp) ||
        (w.from.componentId === b && w.from.portKey === bp && w.to.componentId === a && w.to.portKey === ap)
    );
}

function highlightPorts() {
    document.querySelectorAll(".port").forEach(p => {
        p.classList.remove("pending", "compatible", "incompatible");
    });

    if (!SolarForgeDesigner.pendingPort) return;

    const selected = findPort(
        SolarForgeDesigner.pendingPort.componentId,
        SolarForgeDesigner.pendingPort.portKey
    );

    document.querySelectorAll(".port").forEach(p => {
        const c = p.dataset.component;
        const k = p.dataset.port;
        const port = findPort(c, k);

        if (c === SolarForgeDesigner.pendingPort.componentId &&
            k === SolarForgeDesigner.pendingPort.portKey) {
            p.classList.add("pending");
        } else if (isCompatible(selected, port)) {
            p.classList.add("compatible");
        } else {
            p.classList.add("incompatible");
        }
    });
}

function getPortPosition(componentId, portKey) {
    const card = document.querySelector(`.component-card[data-id="${componentId}"]`);
    const port = card?.querySelector(`.port[data-port="${portKey}"]`);

    if (!card || !port) return null;

    const canvasRect = canvas.getBoundingClientRect();
    const portRect = port.getBoundingClientRect();

    return {
        x: (portRect.left + portRect.width / 2 - canvasRect.left) / SolarForgeDesigner.zoom,
        y: (portRect.top + portRect.height / 2 - canvasRect.top) / SolarForgeDesigner.zoom
    };
}

function renderWires() {
    const width = Math.max(canvas.scrollWidth, 1600);
    const height = Math.max(canvas.scrollHeight, 1100);

    wireLayer.setAttribute("width", width);
    wireLayer.setAttribute("height", height);
    wireLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);

    wireLayer.innerHTML = "";

    SolarForgeDesigner.connections.forEach(wire => {
        const a = getPortPosition(wire.from.componentId, wire.from.portKey);
        const b = getPortPosition(wire.to.componentId, wire.to.portKey);
        if (!a || !b) return;

        const dx = Math.max(60, Math.abs(b.x - a.x) * 0.45);
        const direction = b.x >= a.x ? 1 : -1;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d",
            `M ${a.x} ${a.y} C ${a.x + dx * direction} ${a.y}, ${b.x - dx * direction} ${b.y}, ${b.x} ${b.y}`
        );
        path.setAttribute("class", "wire " + wire.kind);

        path.addEventListener("click", e => {
            e.stopPropagation();
            saveHistory();
            SolarForgeDesigner.connections =
                SolarForgeDesigner.connections.filter(x => x.id !== wire.id);
            render();
            showToast("Connection removed", "info");
        });

        wireLayer.appendChild(path);

        const hit = path.cloneNode();
        hit.removeAttribute("class");
        hit.setAttribute("class", "wire-hit");
        hit.addEventListener("click", e => {
            e.stopPropagation();
            saveHistory();
            SolarForgeDesigner.connections =
                SolarForgeDesigner.connections.filter(x => x.id !== wire.id);
            render();
        });
        wireLayer.appendChild(hit);
    });
}

function renderProperties() {
    const component = findComponent(SolarForgeDesigner.selectedId);

    if (!component) {
        document.getElementById("selectionStatus").textContent = "No component selected";
        propertiesContent.innerHTML = `
            <div class="empty-properties">
                <div class="empty-icon">⌁</div>
                <h3>Select a component</h3>
                <p>Choose a material from the library or select an existing component on the canvas.</p>
            </div>
        `;
        return;
    }

    document.getElementById("selectionStatus").textContent = component.model;

    const fields = Object.entries(component.fields)
        .map(([key, value]) => `
            <div class="property-row">
                <span>${key}</span>
                <strong>${value}</strong>
            </div>
        `).join("");

    propertiesContent.innerHTML = `
        <div class="selected-product">
            <div class="selected-image">${materialImage({
                type: component.materialType,
                image: component.image,
                name: component.name
            })}</div>
            <div>
                <h3>${component.name}</h3>
                <p>${component.model}</p>
            </div>
        </div>

        <div class="property-section">
            <div class="section-label">Specifications</div>
            ${fields}
        </div>

        <div class="property-section">
            <div class="section-label">Connection Ports</div>
            <div class="port-list">
                ${component.ports.map(p => `
                    <div class="port-list-row">
                        <span class="mini-port ${p.kind}"></span>
                        <span>${p.label}</span>
                        <small>${p.kind}</small>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="property-actions">
            <button id="duplicateComponent" class="secondary-btn">Duplicate</button>
            <button id="deleteComponent" class="delete-btn">Delete</button>
        </div>
    `;

    document.getElementById("duplicateComponent").onclick = duplicateSelected;
    document.getElementById("deleteComponent").onclick = deleteSelected;
}

function duplicateSelected() {
    const original = findComponent(SolarForgeDesigner.selectedId);
    if (!original) return;

    saveHistory();

    const copy = clone(original);
    copy.id = uid();
    copy.x += 40;
    copy.y += 40;

    SolarForgeDesigner.components.push(copy);
    SolarForgeDesigner.selectedId = copy.id;
    render();
}

function deleteSelected() {
    if (!SolarForgeDesigner.selectedId) return;

    saveHistory();

    const id = SolarForgeDesigner.selectedId;
    SolarForgeDesigner.components =
        SolarForgeDesigner.components.filter(c => c.id !== id);

    SolarForgeDesigner.connections =
        SolarForgeDesigner.connections.filter(w =>
            w.from.componentId !== id && w.to.componentId !== id
        );

    SolarForgeDesigner.selectedId = null;
    SolarForgeDesigner.pendingPort = null;

    render();
    showToast("Component deleted", "info");
}

function updateSummary() {
    document.getElementById("summaryComponents").textContent =
        SolarForgeDesigner.components.length;

    document.getElementById("summaryConnections").textContent =
        SolarForgeDesigner.connections.length;

    const power = SolarForgeDesigner.components
        .filter(c => c.materialType === "pv")
        .reduce((sum, c) => sum + Number(c.power || 0), 0);

    document.getElementById("summaryPower").textContent =
        formatNumber(power) + " W";

    const status = document.getElementById("designStatus");

    if (SolarForgeDesigner.components.length === 0) {
        status.className = "status good";
        status.textContent = "● Design canvas ready";
    } else if (SolarForgeDesigner.pendingPort) {
        status.className = "status warning";
        status.textContent = "● Choose a compatible port";
    } else {
        status.className = "status good";
        status.textContent = "● Design editable";
    }
}

function formatNumber(n) {
    return Number(n || 0).toLocaleString("en-US");
}

function undo() {
    const previous = SolarForgeDesigner.history.pop();
    if (!previous) return;

    SolarForgeDesigner.future.push({
        components: clone(SolarForgeDesigner.components),
        connections: clone(SolarForgeDesigner.connections)
    });

    SolarForgeDesigner.components = previous.components;
    SolarForgeDesigner.connections = previous.connections;
    SolarForgeDesigner.selectedId = null;
    SolarForgeDesigner.pendingPort = null;

    render();
}

function redo() {
    const next = SolarForgeDesigner.future.pop();
    if (!next) return;

    SolarForgeDesigner.history.push({
        components: clone(SolarForgeDesigner.components),
        connections: clone(SolarForgeDesigner.connections)
    });

    SolarForgeDesigner.components = next.components;
    SolarForgeDesigner.connections = next.connections;

    render();
}

function saveDesign() {
    const data = {
        version: 1,
        savedAt: new Date().toISOString(),
        components: SolarForgeDesigner.components,
        connections: SolarForgeDesigner.connections
    };

    localStorage.setItem("solarforge_system_design", JSON.stringify(data));
    showToast("Design saved to this device", "success");
}

function loadDesign() {
    const saved = localStorage.getItem("solarforge_system_design");
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        SolarForgeDesigner.components = Array.isArray(data.components) ? data.components : [];
        SolarForgeDesigner.connections = Array.isArray(data.connections) ? data.connections : [];

        const maxId = SolarForgeDesigner.components.reduce((max, c) => {
            const n = parseInt(String(c.id).replace("C", ""), 10);
            return Number.isFinite(n) ? Math.max(max, n) : max;
        }, 0);

        SolarForgeDesigner.nextId = maxId + 1;
    } catch (e) {
        console.error("Unable to load SolarForge design:", e);
    }
}

function clearDesign() {
    if (!SolarForgeDesigner.components.length) return;
    if (!confirm("Clear the entire design canvas?")) return;

    saveHistory();

    SolarForgeDesigner.components = [];
    SolarForgeDesigner.connections = [];
    SolarForgeDesigner.selectedId = null;
    SolarForgeDesigner.pendingPort = null;

    render();
    showToast("Canvas cleared", "info");
}

function setupTools() {
    document.getElementById("selectTool").onclick = () => setTool("select");
    document.getElementById("wireTool").onclick = () => setTool("wire");
    document.getElementById("deleteTool").onclick = () => setTool("delete");

    document.getElementById("undoBtn").onclick = undo;
    document.getElementById("redoBtn").onclick = redo;
    document.getElementById("saveBtn").onclick = saveDesign;
    document.getElementById("clearBtn").onclick = clearDesign;

    document.getElementById("zoomIn").onclick = () => setZoom(SolarForgeDesigner.zoom + 0.1);
    document.getElementById("zoomOut").onclick = () => setZoom(SolarForgeDesigner.zoom - 0.1);

    document.getElementById("fitBtn").onclick = () => {
        setZoom(1);
        document.getElementById("canvasViewport").scrollTo({left: 0, top: 0, behavior: "smooth"});
    };

    document.getElementById("closeProperties").onclick = () => {
        SolarForgeDesigner.selectedId = null;
        render();
    };

    document.getElementById("materialSearch").addEventListener("input", renderMaterials);

    document.querySelectorAll(".filter").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
            btn.classList.add("active");
            renderMaterials();
        };
    });

    canvas.addEventListener("click", e => {
        if (e.target === canvas) {
            SolarForgeDesigner.selectedId = null;
            SolarForgeDesigner.pendingPort = null;
            render();
        }
    });

    window.addEventListener("resize", renderWires);
}

function setTool(tool) {
    SolarForgeDesigner.tool = tool;

    document.querySelectorAll(".tool").forEach(b => b.classList.remove("active"));
    const map = {
        select: "selectTool",
        wire: "wireTool",
        delete: "deleteTool"
    };

    document.getElementById(map[tool])?.classList.add("active");

    if (tool !== "wire") {
        SolarForgeDesigner.pendingPort = null;
        highlightPorts();
    }
}

function setZoom(value) {
    SolarForgeDesigner.zoom = Math.max(0.7, Math.min(1.5, value));
    canvas.style.transform = `scale(${SolarForgeDesigner.zoom})`;
    canvas.style.transformOrigin = "0 0";
    document.getElementById("zoomValue").textContent =
        Math.round(SolarForgeDesigner.zoom * 100) + "%";
    setTimeout(renderWires, 30);
}

function demoDesign() {
    // Empty by default. The user builds the system manually.
}

loadDesign();
setupTools();
renderMaterials();
render();
