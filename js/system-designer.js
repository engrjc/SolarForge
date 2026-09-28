// ========================================
// SolarForge Visual System Designer
// Flexible Engineering Workspace
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

    future: [],

    materialsCollapsed: false,

    propertiesCollapsed: false
};


/* ========================================
   MATERIAL LIBRARY
======================================== */

const MATERIALS = [

    {
        type: "pv",
        name: "Solar Panel",
        model: "550W Monocrystalline",
        power: 550,
        image: "",

        fields: {
            "Power": "550 W",
            "Voc": "49.8 V",
            "Vmp": "41.5 V",
            "Isc": "14.2 A"
        },

        ports: [
            {
                key: "positive",
                label: "+",
                side: "right",
                kind: "dc-positive"
            },
            {
                key: "negative",
                label: "−",
                side: "right-bottom",
                kind: "dc-negative"
            }
        ]
    },


    {
        type: "inverter",
        name: "Hybrid Inverter",
        model: "5kW / 48V Hybrid Inverter",
        power: 5000,
        image: "",

        fields: {
            "Rated Power": "5,000 W",
            "Battery": "48 V",
            "Max PV": "6,500 W",
            "MPPT": "2"
        },

        ports: [
            {
                key: "pv-positive",
                label: "PV+",
                side: "left-top",
                kind: "dc-positive"
            },

            {
                key: "pv-negative",
                label: "PV−",
                side: "left-bottom",
                kind: "dc-negative"
            },

            {
                key: "battery-positive",
                label: "BAT+",
                side: "bottom-left",
                kind: "battery-positive"
            },

            {
                key: "battery-negative",
                label: "BAT−",
                side: "bottom-right",
                kind: "battery-negative"
            },

            {
                key: "ac-line",
                label: "AC-L",
                side: "right-top",
                kind: "ac-line"
            },

            {
                key: "ac-neutral",
                label: "AC-N",
                side: "right-bottom",
                kind: "ac-neutral"
            },

            {
                key: "ground",
                label: "PE",
                side: "bottom-center",
                kind: "ground"
            }
        ]
    },


    {
        type: "battery",
        name: "Battery",
        model: "48V 100Ah LiFePO4",
        power: 4800,
        image: "",

        fields: {
            "Nominal": "48 V",
            "Capacity": "100 Ah",
            "Energy": "4.8 kWh",
            "Chemistry": "LiFePO4"
        },

        ports: [
            {
                key: "positive",
                label: "+",
                side: "top-left",
                kind: "battery-positive"
            },

            {
                key: "negative",
                label: "−",
                side: "top-right",
                kind: "battery-negative"
            }
        ]
    },


    {
        type: "protection",
        name: "DC Isolator",
        model: "1000V / 32A DC Isolator",
        power: 0,
        image: "",

        fields: {
            "Voltage": "1000 VDC",
            "Current": "32 A",
            "Poles": "2P"
        },

        ports: [
            {
                key: "in-positive",
                label: "IN+",
                side: "left-top",
                kind: "dc-positive"
            },

            {
                key: "in-negative",
                label: "IN−",
                side: "left-bottom",
                kind: "dc-negative"
            },

            {
                key: "out-positive",
                label: "OUT+",
                side: "right-top",
                kind: "dc-positive"
            },

            {
                key: "out-negative",
                label: "OUT−",
                side: "right-bottom",
                kind: "dc-negative"
            }
        ]
    },


    {
        type: "protection",
        name: "DC SPD",
        model: "PV DC SPD Type 2",
        power: 0,
        image: "",

        fields: {
            "Voltage": "600 VDC",
            "Type": "Type 2",
            "Poles": "2P"
        },

        ports: [
            {
                key: "in-positive",
                label: "IN+",
                side: "left-top",
                kind: "dc-positive"
            },

            {
                key: "in-negative",
                label: "IN−",
                side: "left-bottom",
                kind: "dc-negative"
            },

            {
                key: "out-positive",
                label: "OUT+",
                side: "right-top",
                kind: "dc-positive"
            },

            {
                key: "out-negative",
                label: "OUT−",
                side: "right-bottom",
                kind: "dc-negative"
            },

            {
                key: "ground",
                label: "PE",
                side: "bottom-center",
                kind: "ground"
            }
        ]
    },


    {
        type: "protection",
        name: "AC Breaker",
        model: "2P 32A AC Breaker",
        power: 0,
        image: "",

        fields: {
            "Voltage": "240 VAC",
            "Current": "32 A",
            "Poles": "2P"
        },

        ports: [
            {
                key: "in-line",
                label: "IN-L",
                side: "left-top",
                kind: "ac-line"
            },

            {
                key: "in-neutral",
                label: "IN-N",
                side: "left-bottom",
                kind: "ac-neutral"
            },

            {
                key: "out-line",
                label: "OUT-L",
                side: "right-top",
                kind: "ac-line"
            },

            {
                key: "out-neutral",
                label: "OUT-N",
                side: "right-bottom",
                kind: "ac-neutral"
            }
        ]
    },


    {
        type: "protection",
        name: "AC SPD",
        model: "AC SPD Type 2",
        power: 0,
        image: "",

        fields: {
            "Voltage": "275 VAC",
            "Type": "Type 2",
            "Poles": "2P"
        },

        ports: [
            {
                key: "in-line",
                label: "IN-L",
                side: "left-top",
                kind: "ac-line"
            },

            {
                key: "in-neutral",
                label: "IN-N",
                side: "left-bottom",
                kind: "ac-neutral"
            },

            {
                key: "out-line",
                label: "OUT-L",
                side: "right-top",
                kind: "ac-line"
            },

            {
                key: "out-neutral",
                label: "OUT-N",
                side: "right-bottom",
                kind: "ac-neutral"
            },

            {
                key: "ground",
                label: "PE",
                side: "bottom-center",
                kind: "ground"
            }
        ]
    },


    {
        type: "load",
        name: "AC Load",
        model: "Residential Loads",
        power: 2500,
        image: "",

        fields: {
            "Connected Load": "2,500 W",
            "Type": "AC Load"
        },

        ports: [
            {
                key: "line",
                label: "L",
                side: "left-top",
                kind: "ac-line"
            },

            {
                key: "neutral",
                label: "N",
                side: "left-bottom",
                kind: "ac-neutral"
            },

            {
                key: "ground",
                label: "PE",
                side: "left-center",
                kind: "ground"
            }
        ]
    }

];


/* ========================================
   PORT COMPATIBILITY
======================================== */

const portCompatibility = {

    "dc-positive": [
        "dc-positive"
    ],

    "dc-negative": [
        "dc-negative"
    ],

    "battery-positive": [
        "battery-positive"
    ],

    "battery-negative": [
        "battery-negative"
    ],

    "ac-line": [
        "ac-line"
    ],

    "ac-neutral": [
        "ac-neutral"
    ],

    "ground": [
        "ground"
    ]

};


/* ========================================
   DOM REFERENCES
======================================== */

const canvasViewport =
    document.getElementById("designerCanvas");

const canvas =
    document.getElementById("designCanvas");

const componentLayer =
    document.getElementById("componentLayer");

const wireLayer =
    document.getElementById("wireLayer");

const materialList =
    document.getElementById("materialsList");

const propertiesContent =
    document.getElementById("propertiesContent");

const toast =
    document.getElementById("toast");

const materialsPanel =
    document.getElementById("materialsPanel");

const propertiesPanel =
    document.getElementById("propertiesPanel");

const designerBody =
    document.querySelector(".designer-body");


/* ========================================
   UTILITY
======================================== */

function uid() {

    return "C" +
        SolarForgeDesigner.nextId++;

}


function clone(obj) {

    return JSON.parse(
        JSON.stringify(obj)
    );

}


function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString("en-US");

}


/* ========================================
   HISTORY
======================================== */

function saveHistory() {

    SolarForgeDesigner.history.push({

        components:
            clone(
                SolarForgeDesigner.components
            ),

        connections:
            clone(
                SolarForgeDesigner.connections
            )

    });

    if (
        SolarForgeDesigner.history.length >
        30
    ) {

        SolarForgeDesigner.history.shift();

    }

    SolarForgeDesigner.future = [];

}


/* ========================================
   TOAST
======================================== */

function showToast(
    message,
    type = "info"
) {

    toast.textContent = message;

    toast.className =
        "toast show " + type;

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* ========================================
   MATERIAL IMAGE
======================================== */

function materialImage(material) {

    if (material.image) {

        return `
            <img
                src="${material.image}"
                alt="${material.name}"
                onerror="this.style.display='none'">
        `;

    }

    const icons = {

        pv: "☀",

        inverter: "⚡",

        battery: "🔋",

        protection: "▣",

        load: "⌂"

    };

    return `
        <div class="fallback-image">
            ${icons[material.type] || "◈"}
        </div>
    `;

}


/* ========================================
   MATERIAL LIBRARY
======================================== */

function renderMaterials() {

    const searchInput =
        document.getElementById(
            "materialSearch"
        );

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    const active =
        document.querySelector(
            ".filter-button.active"
        )?.dataset.filter || "all";

    materialList.innerHTML = "";

    MATERIALS

        .filter(material => {

            return (
                active === "all" ||
                material.type === active
            );

        })

        .filter(material => {

            return (
                material.name +
                " " +
                material.model
            )
                .toLowerCase()
                .includes(query);

        })

        .forEach(material => {

            const card =
                document.createElement("div");

            card.className =
                "material-card";

            card.innerHTML = `

                <div class="material-thumb">

                    ${materialImage(material)}

                </div>

                <div class="material-info">

                    <strong>
                        ${material.name}
                    </strong>

                    <span>
                        ${material.model}
                    </span>

                </div>

                <button
                    class="add-material"
                    type="button">

                    Add

                </button>

            `;

            card
                .querySelector(".add-material")
                .addEventListener(
                    "click",
                    () => addComponent(material)
                );

            materialList.appendChild(card);

        });

}


/* ========================================
   ADD COMPONENT
======================================== */

function addComponent(material) {

    saveHistory();

    const count =
        SolarForgeDesigner.components.length;

    const component = {

        id: uid(),

        materialType:
            material.type,

        name:
            material.name,

        model:
            material.model,

        power:
            material.power || 0,

        image:
            material.image || "",

        fields:
            clone(
                material.fields || {}
            ),

        ports:
            clone(
                material.ports || []
            ),

        x:
            180 +
            ((count % 4) * 360),

        y:
            160 +
            (
                Math.floor(count / 4) *
                260
            )

    };

    SolarForgeDesigner.components.push(
        component
    );

    SolarForgeDesigner.selectedId =
        component.id;

    render();

    showToast(
        `${material.name} added to design`,
        "success"
    );

}


/* ========================================
   MAIN RENDER
======================================== */

function render() {

    renderComponents();

    renderWires();

    updateSummary();

    renderProperties();

    updateEmptyState();

    highlightPorts();

}


/* ========================================
   COMPONENT RENDERING
======================================== */

function renderComponents() {

    componentLayer.innerHTML = "";

    SolarForgeDesigner.components
        .forEach(component => {

            const card =
                document.createElement("div");

            card.className =
                "component-card " +
                component.materialType;

            card.dataset.id =
                component.id;

            card.style.left =
                component.x + "px";

            card.style.top =
                component.y + "px";


            if (
                SolarForgeDesigner.selectedId ===
                component.id
            ) {

                card.classList.add(
                    "selected"
                );

            }


            card.innerHTML = `

                <div class="component-header">

                    <div class="component-icon">

                        ${materialImage({

                            type:
                                component.materialType,

                            image:
                                component.image,

                            name:
                                component.name

                        })}

                    </div>

                    <div>

                        <strong>
                            ${component.name}
                        </strong>

                        <span>
                            ${component.model}
                        </span>

                    </div>

                </div>

                <div class="component-power">

                    ${
                        component.power
                            ? formatNumber(
                                component.power
                              ) + " W"
                            : "Protection / Connection"
                    }

                </div>

                <div class="ports"></div>

            `;


            const ports =
                card.querySelector(
                    ".ports"
                );


            /*
             * Render EVERY port.
             * Nothing is filtered or hidden.
             */

            component.ports.forEach(port => {

                const portButton =
                    document.createElement(
                        "button"
                    );

                portButton.type =
                    "button";

                portButton.className =
                    `port ${port.kind}`;

                portButton.dataset.component =
                    component.id;

                portButton.dataset.port =
                    port.key;

                portButton.title =
                    `${port.label} — ${port.kind}`;

                portButton.innerHTML = `

                    <span></span>

                    <b>
                        ${port.label}
                    </b>

                `;

                placePort(
                    portButton,
                    port.side
                );


                portButton.addEventListener(
                    "pointerdown",
                    event => {

                        event.stopPropagation();

                    }
                );


                portButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        handlePortClick(
                            component.id,
                            port.key
                        );

                    }
                );


                ports.appendChild(
                    portButton
                );

            });


            card.addEventListener(
                "click",
                event => {

                    if (
                        !event.target.closest(
                            ".port"
                        )
                    ) {

                        SolarForgeDesigner.selectedId =
                            component.id;

                        render();

                    }

                }
            );


            enableDrag(
                card,
                component
            );


            componentLayer.appendChild(
                card
            );

        });

}


/* ========================================
   PORT POSITION
======================================== */

function placePort(
    element,
    side
) {

    element.classList.add(
        "port-" + side
    );

}


/* ========================================
   DRAG COMPONENT
======================================== */

function enableDrag(
    card,
    component
) {

    let dragging = false;

    let moved = false;

    let startX = 0;

    let startY = 0;

    let originX = 0;

    let originY = 0;

    let pointerId = null;


    card.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".port"
                )
            ) {

                return;

            }


            if (
                SolarForgeDesigner.tool ===
                "wire"
            ) {

                return;

            }


            if (
                SolarForgeDesigner.tool ===
                "delete"
            ) {

                SolarForgeDesigner.selectedId =
                    component.id;

                deleteSelected();

                return;

            }


            dragging = true;

            moved = false;

            pointerId =
                event.pointerId;

            startX =
                event.clientX;

            startY =
                event.clientY;

            originX =
                component.x;

            originY =
                component.y;


            SolarForgeDesigner.selectedId =
                component.id;


            card.classList.add(
                "dragging"
            );


            card.setPointerCapture(
                pointerId
            );


            event.preventDefault();

        }
    );


    card.addEventListener(
        "pointermove",
        event => {

            if (
                !dragging ||
                event.pointerId !== pointerId
            ) {

                return;

            }


            const dx =
                (
                    event.clientX -
                    startX
                ) /
                SolarForgeDesigner.zoom;


            const dy =
                (
                    event.clientY -
                    startY
                ) /
                SolarForgeDesigner.zoom;


            if (
                Math.abs(dx) > 2 ||
                Math.abs(dy) > 2
            ) {

                moved = true;

            }


            component.x =
                Math.max(
                    20,
                    originX + dx
                );


            component.y =
                Math.max(
                    20,
                    originY + dy
                );


            card.style.left =
                component.x + "px";

            card.style.top =
                component.y + "px";


            renderWires();


            updateCoordinates(
                component.x,
                component.y
            );

        }
    );


    card.addEventListener(
        "pointerup",
        event => {

            if (
                !dragging ||
                event.pointerId !== pointerId
            ) {

                return;

            }


            dragging = false;

            card.classList.remove(
                "dragging"
            );


            try {

                card.releasePointerCapture(
                    pointerId
                );

            } catch (error) {
                // Pointer capture may already be released.
            }


            if (moved) {

                saveHistory();

            }


            updateSummary();

        }
    );


    card.addEventListener(
        "pointercancel",
        () => {

            if (!dragging) return;

            dragging = false;

            card.classList.remove(
                "dragging"
            );

            component.x =
                originX;

            component.y =
                originY;

            card.style.left =
                component.x + "px";

            card.style.top =
                component.y + "px";

            renderWires();

        }
    );

}


/* ========================================
   FIND COMPONENT / PORT
======================================== */

function findComponent(id) {

    return SolarForgeDesigner.components
        .find(
            component =>
                component.id === id
        );

}


function findPort(
    componentId,
    portKey
) {

    const component =
        findComponent(
            componentId
        );

    return component?.ports.find(
        port =>
            port.key === portKey
    );

}


/* ========================================
   PORT CONNECTION
======================================== */

function handlePortClick(
    componentId,
    portKey
) {

    const component =
        findComponent(
            componentId
        );

    const port =
        findPort(
            componentId,
            portKey
        );


    if (
        !component ||
        !port
    ) {

        return;

    }


    if (
        !SolarForgeDesigner.pendingPort
    ) {

        SolarForgeDesigner.pendingPort = {

            componentId,

            portKey

        };


        SolarForgeDesigner.selectedId =
            componentId;


        highlightPorts();


        showToast(
            `Selected ${component.name} ${port.label}. Choose a compatible port.`,
            "info"
        );


        return;

    }


    const first =
        SolarForgeDesigner.pendingPort;


    if (
        first.componentId ===
            componentId &&
        first.portKey ===
            portKey
    ) {

        SolarForgeDesigner.pendingPort =
            null;

        highlightPorts();


        showToast(
            "Connection cancelled",
            "info"
        );


        return;

    }


    const firstPort =
        findPort(
            first.componentId,
            first.portKey
        );


    if (
        !isCompatible(
            firstPort,
            port
        )
    ) {

        showToast(
            `Cannot connect ${firstPort.label} to ${port.label}. Use matching electrical ports.`,
            "error"
        );

        return;

    }


    if (
        connectionExists(
            first.componentId,
            first.portKey,
            componentId,
            portKey
        )
    ) {

        SolarForgeDesigner.pendingPort =
            null;

        highlightPorts();


        showToast(
            "Those ports are already connected.",
            "error"
        );


        return;

    }


    saveHistory();


    SolarForgeDesigner.connections.push({

        id:
            "W" +
            Date.now() +
            Math.random()
                .toString(36)
                .slice(2, 7),

        from: {

            componentId:
                first.componentId,

            portKey:
                first.portKey

        },

        to: {

            componentId,

            portKey

        },

        kind:
            firstPort.kind

    });


    SolarForgeDesigner.pendingPort =
        null;


    render();


    showToast(
        "Connection created",
        "success"
    );

}


/* ========================================
   COMPATIBILITY
======================================== */

function isCompatible(
    a,
    b
) {

    return (
        a &&
        b &&
        (
            portCompatibility[a.kind] ||
            []
        ).includes(
            b.kind
        )
    );

}


/* ========================================
   CONNECTION EXISTS
======================================== */

function connectionExists(
    a,
    ap,
    b,
    bp
) {

    return SolarForgeDesigner
        .connections
        .some(wire =>

            (
                wire.from.componentId === a &&
                wire.from.portKey === ap &&
                wire.to.componentId === b &&
                wire.to.portKey === bp
            )

            ||

            (
                wire.from.componentId === b &&
                wire.from.portKey === bp &&
                wire.to.componentId === a &&
                wire.to.portKey === ap
            )

        );

}


/* ========================================
   HIGHLIGHT PORTS
======================================== */

function highlightPorts() {

    document
        .querySelectorAll(".port")
        .forEach(port => {

            port.classList.remove(
                "pending",
                "compatible",
                "incompatible",
                "connected"
            );

        });


    SolarForgeDesigner
        .connections
        .forEach(wire => {

            const from =
                document.querySelector(
                    `.port[data-component="${wire.from.componentId}"][data-port="${wire.from.portKey}"]`
                );

            const to =
                document.querySelector(
                    `.port[data-component="${wire.to.componentId}"][data-port="${wire.to.portKey}"]`
                );

            from?.classList.add(
                "connected"
            );

            to?.classList.add(
                "connected"
            );

        });


    if (
        !SolarForgeDesigner.pendingPort
    ) {

        return;

    }


    const selected =
        findPort(
            SolarForgeDesigner.pendingPort
                .componentId,

            SolarForgeDesigner.pendingPort
                .portKey
        );


    document
        .querySelectorAll(".port")
        .forEach(port => {

            const componentId =
                port.dataset.component;

            const portKey =
                port.dataset.port;

            const currentPort =
                findPort(
                    componentId,
                    portKey
                );


            if (
                componentId ===
                    SolarForgeDesigner
                        .pendingPort
                        .componentId
                &&
                portKey ===
                    SolarForgeDesigner
                        .pendingPort
                        .portKey
            ) {

                port.classList.add(
                    "pending"
                );

            }

            else if (
                isCompatible(
                    selected,
                    currentPort
                )
            ) {

                port.classList.add(
                    "compatible"
                );

            }

            else {

                port.classList.add(
                    "incompatible"
                );

            }

        });

}


/* ========================================
   PORT POSITION FOR WIRES
======================================== */

function getPortPosition(
    componentId,
    portKey
) {

    const card =
        document.querySelector(
            `.component-card[data-id="${componentId}"]`
        );


    const port =
        card?.querySelector(
            `.port[data-port="${portKey}"]`
        );


    if (
        !card ||
        !port
    ) {

        return null;

    }


    const canvasRect =
        canvas.getBoundingClientRect();


    const portRect =
        port.getBoundingClientRect();


    return {

        x:
            (
                portRect.left +
                portRect.width / 2 -
                canvasRect.left
            ) /
            SolarForgeDesigner.zoom,

        y:
            (
                portRect.top +
                portRect.height / 2 -
                canvasRect.top
            ) /
            SolarForgeDesigner.zoom

    };

}


/* ========================================
   RENDER WIRES
======================================== */

function renderWires() {

    if (!wireLayer) return;


    const width = 2200;

    const height = 1400;


    wireLayer.setAttribute(
        "width",
        width
    );

    wireLayer.setAttribute(
        "height",
        height
    );

    wireLayer.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    wireLayer.innerHTML = "";


    SolarForgeDesigner
        .connections
        .forEach(wire => {

            const a =
                getPortPosition(
                    wire.from.componentId,
                    wire.from.portKey
                );


            const b =
                getPortPosition(
                    wire.to.componentId,
                    wire.to.portKey
                );


            if (
                !a ||
                !b
            ) {

                return;

            }


            const dx =
                Math.max(
                    70,
                    Math.abs(
                        b.x - a.x
                    ) * .45
                );


            const direction =
                b.x >= a.x
                    ? 1
                    : -1;


            const path =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );


            path.setAttribute(
                "d",
                `
                    M ${a.x} ${a.y}

                    C
                    ${a.x + dx * direction}
                    ${a.y},

                    ${b.x - dx * direction}
                    ${b.y},

                    ${b.x}
                    ${b.y}
                `
            );


            path.setAttribute(
                "class",
                "wire " +
                wire.kind
            );


            path.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    removeConnection(
                        wire.id
                    );

                }
            );


            wireLayer.appendChild(
                path
            );


            const hit =
                path.cloneNode();


            hit.removeAttribute(
                "class"
            );


            hit.setAttribute(
                "class",
                "wire-hit"
            );


            hit.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    removeConnection(
                        wire.id
                    );

                }
            );


            wireLayer.appendChild(
                hit
            );

        });

}


/* ========================================
   REMOVE CONNECTION
======================================== */

function removeConnection(
    connectionId
) {

    saveHistory();


    SolarForgeDesigner.connections =
        SolarForgeDesigner.connections
            .filter(
                connection =>
                    connection.id !==
                    connectionId
            );


    render();


    showToast(
        "Connection removed",
        "info"
    );

}


/* ========================================
   PROPERTIES
======================================== */

function renderProperties() {

    const component =
        findComponent(
            SolarForgeDesigner.selectedId
        );


    if (!component) {

        propertiesContent.innerHTML = `

            <div class="properties-empty">

                <div class="properties-empty-icon">
                    ◇
                </div>

                <h3>
                    No Component Selected
                </h3>

                <p>
                    Select a component on the canvas
                    to view its specifications,
                    ports and information.
                </p>

            </div>

        `;

        return;

    }


    const fields =
        Object.entries(
            component.fields
        )

        .map(
            ([key, value]) => `

                <div class="property-row">

                    <span>
                        ${key}
                    </span>

                    <strong>
                        ${value}
                    </strong>

                </div>

            `
        )

        .join("");


    const portRows =
        component.ports

        .map(
            port => `

                <div class="port-list-row">

                    <span
                        class="mini-port ${port.kind}">
                    </span>

                    <span>
                        ${port.label}
                    </span>

                    <small>
                        ${port.kind}
                    </small>

                </div>

            `
        )

        .join("");


    propertiesContent.innerHTML = `

        <div class="selected-product">

            <div class="selected-image">

                ${materialImage({

                    type:
                        component.materialType,

                    image:
                        component.image,

                    name:
                        component.name

                })}

            </div>

            <div>

                <h3>
                    ${component.name}
                </h3>

                <p>
                    ${component.model}
                </p>

            </div>

        </div>


        <div class="property-section">

            <div class="section-label">
                Specifications
            </div>

            ${fields}

        </div>


        <div class="property-section">

            <div class="section-label">
                Connection Ports
            </div>

            <div class="port-list">

                ${portRows}

            </div>

        </div>


        <div class="property-actions">

            <button
                id="duplicateComponent"
                class="secondary-btn"
                type="button">

                Duplicate

            </button>


            <button
                id="deleteComponent"
                class="delete-btn"
                type="button">

                Delete

            </button>

        </div>

    `;


    document
        .getElementById(
            "duplicateComponent"
        )
        .onclick =
        duplicateSelected;


    document
        .getElementById(
            "deleteComponent"
        )
        .onclick =
        deleteSelected;

}


/* ========================================
   DUPLICATE
======================================== */

function duplicateSelected() {

    const original =
        findComponent(
            SolarForgeDesigner.selectedId
        );


    if (!original) return;


    saveHistory();


    const copy =
        clone(original);


    copy.id =
        uid();


    copy.x += 60;

    copy.y += 60;


    SolarForgeDesigner.components
        .push(copy);


    SolarForgeDesigner.selectedId =
        copy.id;


    render();


    showToast(
        "Component duplicated",
        "success"
    );

}


/* ========================================
   DELETE
======================================== */

function deleteSelected() {

    if (
        !SolarForgeDesigner.selectedId
    ) {

        return;

    }


    saveHistory();


    const id =
        SolarForgeDesigner.selectedId;


    SolarForgeDesigner.components =
        SolarForgeDesigner.components
            .filter(
                component =>
                    component.id !== id
            );


    SolarForgeDesigner.connections =
        SolarForgeDesigner.connections
            .filter(
                wire =>
                    wire.from.componentId !== id &&
                    wire.to.componentId !== id
            );


    SolarForgeDesigner.selectedId =
        null;


    SolarForgeDesigner.pendingPort =
        null;


    render();


    showToast(
        "Component deleted",
        "info"
    );

}


/* ========================================
   SUMMARY
======================================== */

function updateSummary() {

    const components =
        document.getElementById(
            "summaryComponents"
        );

    const connections =
        document.getElementById(
            "summaryConnections"
        );

    const power =
        document.getElementById(
            "summaryPower"
        );

    const status =
        document.getElementById(
            "designStatus"
        );


    if (components) {

        components.textContent =
            SolarForgeDesigner
                .components
                .length;

    }


    if (connections) {

        connections.textContent =
            SolarForgeDesigner
                .connections
                .length;

    }


    const pvPower =
        SolarForgeDesigner
            .components
            .filter(
                component =>
                    component.materialType ===
                    "pv"
            )
            .reduce(
                (sum, component) =>
                    sum +
                    Number(
                        component.power ||
                        0
                    ),
                0
            );


    if (power) {

        power.textContent =
            formatNumber(
                pvPower
            ) +
            " W";

    }


    if (!status) return;


    if (
        SolarForgeDesigner
            .components
            .length === 0
    ) {

        status.className =
            "status good";

        status.textContent =
            "● Design canvas ready";

    }

    else if (
        SolarForgeDesigner.pendingPort
    ) {

        status.className =
            "status warning";

        status.textContent =
            "● Choose a compatible port";

    }

    else {

        status.className =
            "status good";

        status.textContent =
            "● Design editable";

    }

}


/* ========================================
   EMPTY STATE
======================================== */

function updateEmptyState() {

    const empty =
        document.getElementById(
            "canvasEmptyState"
        );


    if (!empty) return;


    empty.style.display =
        SolarForgeDesigner.components.length
            ? "none"
            : "block";

}


/* ========================================
   COORDINATES
======================================== */

function updateCoordinates(
    x,
    y
) {

    const element =
        document.getElementById(
            "canvasCoordinates"
        );


    if (!element) return;


    element.innerHTML =
        `X: ${Math.round(x)}
         &nbsp;&nbsp;
         Y: ${Math.round(y)}`;

}


/* ========================================
   UNDO
======================================== */

function undo() {

    const previous =
        SolarForgeDesigner.history.pop();


    if (!previous) {

        showToast(
            "Nothing to undo",
            "info"
        );

        return;

    }


    SolarForgeDesigner.future.push({

        components:
            clone(
                SolarForgeDesigner.components
            ),

        connections:
            clone(
                SolarForgeDesigner.connections
            )

    });


    SolarForgeDesigner.components =
        previous.components;


    SolarForgeDesigner.connections =
        previous.connections;


    SolarForgeDesigner.selectedId =
        null;


    SolarForgeDesigner.pendingPort =
        null;


    render();

}


/* ========================================
   REDO
======================================== */

function redo() {

    const next =
        SolarForgeDesigner.future.pop();


    if (!next) {

        showToast(
            "Nothing to redo",
            "info"
        );

        return;

    }


    SolarForgeDesigner.history.push({

        components:
            clone(
                SolarForgeDesigner.components
            ),

        connections:
            clone(
                SolarForgeDesigner.connections
            )

    });


    SolarForgeDesigner.components =
        next.components;


    SolarForgeDesigner.connections =
        next.connections;


    SolarForgeDesigner.selectedId =
        null;


    SolarForgeDesigner.pendingPort =
        null;


    render();

}


/* ========================================
   SAVE DESIGN
======================================== */

function saveDesign() {

    const data = {

        version: 2,

        savedAt:
            new Date()
                .toISOString(),

        components:
            SolarForgeDesigner
                .components,

        connections:
            SolarForgeDesigner
                .connections

    };


    localStorage.setItem(
        "solarforge_system_design",
        JSON.stringify(data)
    );


    showToast(
        "Design saved to this device",
        "success"
    );

}


/* ========================================
   LOAD DESIGN
======================================== */

function loadDesign() {

    const saved =
        localStorage.getItem(
            "solarforge_system_design"
        );


    if (!saved) return;


    try {

        const data =
            JSON.parse(saved);


        SolarForgeDesigner.components =
            Array.isArray(
                data.components
            )
                ? data.components
                : [];


        SolarForgeDesigner.connections =
            Array.isArray(
                data.connections
            )
                ? data.connections
                : [];


        const maxId =
            SolarForgeDesigner
                .components
                .reduce(
                    (max, component) => {

                        const number =
                            parseInt(
                                String(
                                    component.id
                                ).replace(
                                    "C",
                                    ""
                                ),
                                10
                            );


                        return Number.isFinite(
                            number
                        )
                            ? Math.max(
                                max,
                                number
                            )
                            : max;

                    },
                    0
                );


        SolarForgeDesigner.nextId =
            maxId + 1;


    } catch (error) {

        console.error(
            "Unable to load SolarForge design:",
            error
        );

    }

}


/* ========================================
   CLEAR DESIGN
======================================== */

function clearDesign() {

    if (
        !SolarForgeDesigner
            .components
            .length
    ) {

        return;

    }


    if (
        !confirm(
            "Clear the entire design canvas?"
        )
    ) {

        return;

    }


    saveHistory();


    SolarForgeDesigner.components =
        [];

    SolarForgeDesigner.connections =
        [];

    SolarForgeDesigner.selectedId =
        null;

    SolarForgeDesigner.pendingPort =
        null;


    render();


    showToast(
        "Canvas cleared",
        "info"
    );

}


/* ========================================
   PANEL COLLAPSE
======================================== */

function setMaterialsCollapsed(
    collapsed
) {

    SolarForgeDesigner
        .materialsCollapsed =
        collapsed;


    designerBody.classList.toggle(
        "materials-collapsed",
        collapsed
    );


    localStorage.setItem(
        "solarforge_materials_collapsed",
        collapsed
            ? "true"
            : "false"
    );


    setTimeout(
        renderWires,
        280
    );

}


function setPropertiesCollapsed(
    collapsed
) {

    SolarForgeDesigner
        .propertiesCollapsed =
        collapsed;


    designerBody.classList.toggle(
        "properties-collapsed",
        collapsed
    );


    localStorage.setItem(
        "solarforge_properties_collapsed",
        collapsed
            ? "true"
            : "false"
    );


    setTimeout(
        renderWires,
        280
    );

}


/* ========================================
   LOAD PANEL STATE
======================================== */

function loadPanelState() {

    const materials =
        localStorage.getItem(
            "solarforge_materials_collapsed"
        );


    const properties =
        localStorage.getItem(
            "solarforge_properties_collapsed"
        );


    if (
        materials !== null
    ) {

        SolarForgeDesigner
            .materialsCollapsed =
            materials === "true";

    }


    if (
        properties !== null
    ) {

        SolarForgeDesigner
            .propertiesCollapsed =
            properties === "true";

    }


    designerBody.classList.toggle(
        "materials-collapsed",
        SolarForgeDesigner
            .materialsCollapsed
    );


    designerBody.classList.toggle(
        "properties-collapsed",
        SolarForgeDesigner
            .propertiesCollapsed
    );

}


/* ========================================
   TOOL SETUP
======================================== */

function setupTools() {

    document
        .getElementById(
            "selectToolButton"
        )
        .onclick = () =>
            setTool("select");


    document
        .getElementById(
            "wireToolButton"
        )
        .onclick = () =>
            setTool("wire");


    document
        .getElementById(
            "deleteToolButton"
        )
        .onclick = () =>
            setTool("delete");


    document
        .getElementById(
            "undoButton"
        )
        .onclick =
        undo;


    document
        .getElementById(
            "redoButton"
        )
        .onclick =
        redo;


    document
        .getElementById(
            "saveDesignButton"
        )
        .onclick =
        saveDesign;


    document
        .getElementById(
            "clearCanvasButton"
        )
        .onclick =
        clearDesign;


    document
        .getElementById(
            "zoomInButton"
        )
        .onclick = () =>
            setZoom(
                SolarForgeDesigner.zoom +
                .1
            );


    document
        .getElementById(
            "zoomOutButton"
        )
        .onclick = () =>
            setZoom(
                SolarForgeDesigner.zoom -
                .1
            );


    document
        .getElementById(
            "fitCanvasButton"
        )
        .onclick =
        fitCanvas;


    document
        .getElementById(
            "collapseMaterialsButton"
        )
        .onclick = () =>
            setMaterialsCollapsed(
                true
            );


    document
        .getElementById(
            "openMaterialsButton"
        )
        .onclick = () =>
            setMaterialsCollapsed(
                false
            );


    document
        .getElementById(
            "collapsePropertiesButton"
        )
        .onclick = () =>
            setPropertiesCollapsed(
                true
            );


    document
        .getElementById(
            "openPropertiesButton"
        )
        .onclick = () =>
            setPropertiesCollapsed(
                false
            );


    document
        .getElementById(
            "materialSearch"
        )
        .addEventListener(
            "input",
            renderMaterials
        );


    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(button => {

            button.onclick = () => {

                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                button.classList.add(
                    "active"
                );


                renderMaterials();

            };

        });


    canvas.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                canvas
            ) {

                SolarForgeDesigner
                    .selectedId =
                    null;

                SolarForgeDesigner
                    .pendingPort =
                    null;

                render();

            }

        }
    );


    canvasViewport.addEventListener(
        "pointermove",
        event => {

            const rect =
                canvasViewport
                    .getBoundingClientRect();


            const x =
                Math.round(
                    (
                        event.clientX -
                        rect.left +
                        canvasViewport.scrollLeft
                    ) /
                    SolarForgeDesigner.zoom
                );


            const y =
                Math.round(
                    (
                        event.clientY -
                        rect.top +
                        canvasViewport.scrollTop
                    ) /
                    SolarForgeDesigner.zoom
                );


            updateCoordinates(
                x,
                y
            );

        }
    );


    window.addEventListener(
        "resize",
        () => {

            setTimeout(
                renderWires,
                100
            );

        }
    );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* ========================================
   KEYBOARD
======================================== */

function handleKeyboard(
    event
) {

    const active =
        document.activeElement;


    const isTyping =
        active &&
        (
            active.tagName ===
                "INPUT" ||
            active.tagName ===
                "TEXTAREA" ||
            active.tagName ===
                "SELECT"
        );


    if (isTyping) return;


    if (
        event.key ===
        "Delete"
    ) {

        if (
            SolarForgeDesigner
                .selectedId
        ) {

            deleteSelected();

        }

    }


    if (
        event.key ===
        "Escape"
    ) {

        SolarForgeDesigner
            .pendingPort =
            null;

        highlightPorts();

    }

}


/* ========================================
   TOOL
======================================== */

function setTool(
    tool
) {

    SolarForgeDesigner.tool =
        tool;


    document
        .querySelectorAll(
            ".tool-button"
        )
        .forEach(
            button =>
                button.classList
                    .remove(
                        "active"
                    )
        );


    const map = {

        select:
            "selectToolButton",

        wire:
            "wireToolButton",

        delete:
            "deleteToolButton"

    };


    document
        .getElementById(
            map[tool]
        )
        ?.classList.add(
            "active"
        );


    if (
        tool !==
        "wire"
    ) {

        SolarForgeDesigner
            .pendingPort =
            null;

        highlightPorts();

    }


    const status =
        document.getElementById(
            "canvasStatus"
        );


    if (!status) return;


    if (
        tool ===
        "wire"
    ) {

        status.textContent =
            "Wire mode: select a port, then select a compatible port.";

    }

    else if (
        tool ===
        "delete"
    ) {

        status.textContent =
            "Delete mode: select a component to remove it.";

    }

    else {

        status.textContent =
            "Select and drag components to organize the system.";

    }

}


/* ========================================
   ZOOM
======================================== */

function setZoom(
    value
) {

    SolarForgeDesigner.zoom =
        Math.max(
            .5,
            Math.min(
                1.5,
                value
            )
        );


    canvas.style.transform =
        `scale(${SolarForgeDesigner.zoom})`;


    canvas.style.transformOrigin =
        "0 0";


    const zoomValue =
        document.getElementById(
            "zoomValue"
        );


    if (zoomValue) {

        zoomValue.textContent =
            Math.round(
                SolarForgeDesigner.zoom *
                100
            ) +
            "%";

    }


    setTimeout(
        renderWires,
        50
    );

}


/* ========================================
   FIT CANVAS
======================================== */

function fitCanvas() {

    const viewportWidth =
        canvasViewport.clientWidth;

    const viewportHeight =
        canvasViewport.clientHeight;


    if (
        !SolarForgeDesigner
            .components
            .length
    ) {

        setZoom(1);

        canvasViewport.scrollTo({
            left: 0,
            top: 0
        });

        return;

    }


    const minX =
        Math.min(
            ...SolarForgeDesigner
                .components
                .map(
                    component =>
                        component.x
                )
        );


    const minY =
        Math.min(
            ...SolarForgeDesigner
                .components
                .map(
                    component =>
                        component.y
                )
        );


    const maxX =
        Math.max(
            ...SolarForgeDesigner
                .components
                .map(
                    component =>
                        component.x +
                        260
                )
        );


    const maxY =
        Math.max(
            ...SolarForgeDesigner
                .components
                .map(
                    component =>
                        component.y +
                        220
                )
        );


    const requiredWidth =
        Math.max(
            500,
            maxX - minX
        );


    const requiredHeight =
        Math.max(
            400,
            maxY - minY
        );


    const scaleX =
        (
            viewportWidth -
            80
        ) /
        requiredWidth;


    const scaleY =
        (
            viewportHeight -
            80
        ) /
        requiredHeight;


    const scale =
        Math.max(
            .5,
            Math.min(
                1.15,
                scaleX,
                scaleY
            )
        );


    setZoom(scale);


    setTimeout(
        () => {

            canvasViewport.scrollTo({

                left:
                    Math.max(
                        0,
                        (
                            minX *
                            scale
                        ) -
                        40
                    ),

                top:
                    Math.max(
                        0,
                        (
                            minY *
                            scale
                        ) -
                        40
                    ),

                behavior:
                    "smooth"

            });

        },
        80
    );

}


/* ========================================
   PROJECT SELECTOR
======================================== */

function loadCurrentProjectName() {

    const selector =
        document.getElementById(
            "designerProjectSelect"
        );


    if (!selector) return;


    try {

        const saved =
            localStorage.getItem(
                "solarforge_current_project"
            );


        if (!saved) return;


        const project =
            JSON.parse(saved);


        if (
            project.projectName
        ) {

            selector.innerHTML = "";

            const option =
                document.createElement(
                    "option"
                );

            option.textContent =
                project.projectName;

            selector.appendChild(
                option
            );

        }

    } catch (error) {

        console.error(
            "Unable to load project:",
            error
        );

    }

}


/* ========================================
   STARTUP
======================================== */

function initializeDesigner() {

    loadPanelState();

    loadDesign();

    loadCurrentProjectName();

    setupTools();

    renderMaterials();

    render();

    setZoom(1);

}


initializeDesigner();
