// =========================================================
// SolarForge Visual System Designer
// Version 2
//
// Features:
// - Collapsible Materials panel
// - Collapsible Properties panel
// - Floating reopen buttons
// - Large engineering workspace
// - Draggable components
// - Touch/iPad dragging
// - Full visible port set
// - Port-to-port wiring
// - Compatible port highlighting
// - Undo / Redo
// - Save / Load
// - Zoom
// - Component properties
// =========================================================


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

    dragging: false

};


/* =========================================================
   MATERIAL LIBRARY
========================================================= */

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
                side: "right",
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


/* =========================================================
   PORT COMPATIBILITY
========================================================= */

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


/* =========================================================
   DOM REFERENCES
========================================================= */

const canvas =
    document.getElementById("designerCanvas");

const componentLayer =
    document.getElementById("canvasComponents");

const wireLayer =
    document.getElementById("wiringLayer");

const materialList =
    document.getElementById("materialsList");

const propertiesContent =
    document.getElementById("propertiesContent");

const toast =
    document.getElementById("designerToast");

const canvasEmptyState =
    document.getElementById("canvasEmptyState");

const materialsPanel =
    document.getElementById("materialsPanel");

const propertiesPanel =
    document.getElementById("propertiesPanel");

const openMaterialsButton =
    document.getElementById("openMaterialsButton");

const openPropertiesButton =
    document.getElementById("openPropertiesButton");


/* =========================================================
   UTILITIES
========================================================= */

function uid() {

    return "C" +
        SolarForgeDesigner.nextId++;

}


function clone(object) {

    return JSON.parse(
        JSON.stringify(object)
    );

}


function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("en-US");

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "info"
) {

    if (!toast) return;

    toast.textContent =
        message;

    toast.className =
        "designer-toast show " +
        type;

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


/* =========================================================
   HISTORY
========================================================= */

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
        40
    ) {

        SolarForgeDesigner.history.shift();

    }

    SolarForgeDesigner.future = [];

}


/* =========================================================
   MATERIAL IMAGE
========================================================= */

function materialImage(material) {

    if (material.image) {

        return `
            <img
                src="${material.image}"
                alt="${material.name || "Equipment"}"
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
        <div>
            ${icons[material.type] || "◈"}
        </div>
    `;

}


/* =========================================================
   MATERIAL LIST
========================================================= */

function renderMaterials() {

    if (!materialList) return;

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

    const activeFilter =
        document.querySelector(
            ".filter-button.active"
        )?.dataset.filter ||
        "all";

    materialList.innerHTML = "";


    const filtered =
        MATERIALS
            .filter(material => {

                if (
                    activeFilter ===
                    "all"
                ) {

                    return true;

                }

                return (
                    material.type ===
                    activeFilter
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

            });


    if (!filtered.length) {

        materialList.innerHTML = `
            <div class="properties-empty">
                <div class="properties-empty-icon">
                    ⌕
                </div>

                <h3>
                    No Materials Found
                </h3>

                <p>
                    Try another search or
                    material category.
                </p>
            </div>
        `;

        return;

    }


    filtered.forEach(material => {

        const card =
            document.createElement(
                "div"
            );

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
            .querySelector(
                ".add-material"
            )
            .addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    addComponent(
                        material
                    );

                }
            );


        materialList.appendChild(
            card
        );

    });

}


/* =========================================================
   ADD COMPONENT
========================================================= */

function addComponent(material) {

    saveHistory();


    const count =
        SolarForgeDesigner
            .components.length;


    const component = {

        id:
            uid(),

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
            120 +
            ((count % 4) * 310),

        y:
            100 +
            (Math.floor(count / 4) * 230)

    };


    SolarForgeDesigner
        .components
        .push(component);


    SolarForgeDesigner.selectedId =
        component.id;


    render();


    showToast(
        `${material.name} added to design`,
        "success"
    );

}


/* =========================================================
   MAIN RENDER
========================================================= */

function render() {

    renderComponents();

    renderWires();

    updateSummary();

    renderProperties();

    updateEmptyState();

    highlightPorts();

}


/* =========================================================
   RENDER COMPONENTS
========================================================= */

function renderComponents() {

    if (!componentLayer) return;

    componentLayer.innerHTML = "";


    SolarForgeDesigner
        .components
        .forEach(component => {

            const card =
                document.createElement(
                    "div"
                );


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
             * Every port in the component
             * is rendered.
             */

            component.ports.forEach(
                port => {

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
                        `${port.label} — click to connect`;


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

                }
            );


            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".port"
                        )
                    ) {

                        return;

                    }


                    SolarForgeDesigner.selectedId =
                        component.id;


                    if (
                        SolarForgeDesigner.tool ===
                        "delete"
                    ) {

                        deleteComponent(
                            component.id
                        );

                        return;

                    }


                    render();

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


/* =========================================================
   PORT POSITIONING
========================================================= */

function placePort(
    element,
    side
) {

    element.classList.add(
        "port-" + side
    );

}


/* =========================================================
   DRAG COMPONENT
========================================================= */

function enableDrag(
    card,
    component
) {

    let dragging = false;

    let pointerId = null;

    let startX = 0;

    let startY = 0;

    let originX = 0;

    let originY = 0;

    let moved = false;


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

                deleteComponent(
                    component.id
                );

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


            try {

                card.setPointerCapture(
                    pointerId
                );

            } catch (error) {
                // Pointer capture may not be available
            }


            event.preventDefault();

        }
    );


    card.addEventListener(
        "pointermove",
        event => {

            if (
                !dragging ||
                event.pointerId !==
                pointerId
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


            event.preventDefault();

        }
    );


    const finishDrag = event => {

        if (
            !dragging ||
            (
                event.pointerId !==
                undefined &&
                event.pointerId !==
                pointerId
            )
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
            // Pointer capture may already be released
        }


        if (moved) {

            saveHistory();

        }


        SolarForgeDesigner.dragging =
            false;


        updateSummary();

    };


    card.addEventListener(
        "pointerup",
        finishDrag
    );


    card.addEventListener(
        "pointercancel",
        finishDrag
    );

}


/* =========================================================
   COMPONENT FINDERS
========================================================= */

function findComponent(id) {

    return SolarForgeDesigner
        .components
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


    return component
        ?.ports
        .find(
            port =>
                port.key ===
                portKey
        );

}


/* =========================================================
   PORT CONNECTION
========================================================= */

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
        SolarForgeDesigner.tool ===
        "delete"
    ) {

        return;

    }


    /*
     * First port selected
     */

    if (
        !SolarForgeDesigner.pendingPort
    ) {

        SolarForgeDesigner.pendingPort = {

            componentId:
                componentId,

            portKey:
                portKey

        };


        highlightPorts();


        showToast(
            `Selected ${component.name} ${port.label}. Choose a compatible port.`,
            "info"
        );


        return;

    }


    const first =
        SolarForgeDesigner.pendingPort;


    /*
     * Same port clicked
     */

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


    /*
     * Compatibility
     */

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


    /*
     * Prevent duplicate connection
     */

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


    /*
     * Save before modification
     */

    saveHistory();


    SolarForgeDesigner
        .connections
        .push({

            id:
                "W" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() * 1000
                ),

            from: {

                componentId:
                    first.componentId,

                portKey:
                    first.portKey

            },

            to: {

                componentId:
                    componentId,

                portKey:
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


/* =========================================================
   COMPATIBILITY
========================================================= */

function isCompatible(
    firstPort,
    secondPort
) {

    if (
        !firstPort ||
        !secondPort
    ) {

        return false;

    }


    return (
        portCompatibility[
            firstPort.kind
        ] || []
    ).includes(
        secondPort.kind
    );

}


/* =========================================================
   EXISTING CONNECTION
========================================================= */

function connectionExists(
    componentA,
    portA,
    componentB,
    portB
) {

    return SolarForgeDesigner
        .connections
        .some(
            wire => {

                const normal =
                    wire.from.componentId ===
                        componentA &&
                    wire.from.portKey ===
                        portA &&
                    wire.to.componentId ===
                        componentB &&
                    wire.to.portKey ===
                        portB;


                const reverse =
                    wire.from.componentId ===
                        componentB &&
                    wire.from.portKey ===
                        portB &&
                    wire.to.componentId ===
                        componentA &&
                    wire.to.portKey ===
                        portA;


                return normal || reverse;

            }
        );

}


/* =========================================================
   PORT HIGHLIGHTING
========================================================= */

function highlightPorts() {

    document
        .querySelectorAll(".port")
        .forEach(port => {

            port.classList.remove(
                "pending",
                "compatible",
                "incompatible"
            );

        });


    if (
        !SolarForgeDesigner.pendingPort
    ) {

        return;

    }


    const selectedPort =
        findPort(
            SolarForgeDesigner
                .pendingPort
                .componentId,

            SolarForgeDesigner
                .pendingPort
                .portKey
        );


    document
        .querySelectorAll(".port")
        .forEach(element => {

            const componentId =
                element.dataset.component;


            const portKey =
                element.dataset.port;


            const port =
                findPort(
                    componentId,
                    portKey
                );


            if (
                componentId ===
                    SolarForgeDesigner
                        .pendingPort
                        .componentId &&
                portKey ===
                    SolarForgeDesigner
                        .pendingPort
                        .portKey
            ) {

                element.classList.add(
                    "pending"
                );

            }
            else if (
                isCompatible(
                    selectedPort,
                    port
                )
            ) {

                element.classList.add(
                    "compatible"
                );

            }
            else {

                element.classList.add(
                    "incompatible"
                );

            }

        });

}


/* =========================================================
   PORT POSITION
========================================================= */

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


/* =========================================================
   RENDER WIRES
========================================================= */

function renderWires() {

    if (
        !canvas ||
        !wireLayer
    ) {

        return;

    }


    const width =
        Math.max(
            2200,
            canvas.scrollWidth
        );


    const height =
        Math.max(
            1400,
            canvas.scrollHeight
        );


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
        .forEach(
            wire => {

                const start =
                    getPortPosition(
                        wire.from.componentId,
                        wire.from.portKey
                    );


                const end =
                    getPortPosition(
                        wire.to.componentId,
                        wire.to.portKey
                    );


                if (
                    !start ||
                    !end
                ) {

                    return;

                }


                const distance =
                    Math.max(
                        70,
                        Math.abs(
                            end.x -
                            start.x
                        ) * .45
                    );


                const direction =
                    end.x >= start.x
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
                    M ${start.x} ${start.y}
                    C
                    ${start.x + distance * direction}
                    ${start.y},
                    ${end.x - distance * direction}
                    ${end.y},
                    ${end.x} ${end.y}
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
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "path"
                    );


                hit.setAttribute(
                    "d",
                    path.getAttribute("d")
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

            }
        );

}


/* =========================================================
   REMOVE CONNECTION
========================================================= */

function removeConnection(
    wireId
) {

    saveHistory();


    SolarForgeDesigner.connections =
        SolarForgeDesigner
            .connections
            .filter(
                wire =>
                    wire.id !==
                    wireId
            );


    render();


    showToast(
        "Connection removed",
        "info"
    );

}


/* =========================================================
   PROPERTIES
========================================================= */

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
                    Select a component on the
                    canvas to view its information,
                    specifications and ports.
                </p>

            </div>

        `;

        return;

    }


    const fields =
        Object.entries(
            component.fields || {}
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


    const ports =
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

                ${ports}

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


/* =========================================================
   DUPLICATE
========================================================= */

function duplicateSelected() {

    const original =
        findComponent(
            SolarForgeDesigner.selectedId
        );


    if (!original) {

        return;

    }


    saveHistory();


    const copy =
        clone(original);


    copy.id =
        uid();


    copy.x += 50;

    copy.y += 50;


    SolarForgeDesigner
        .components
        .push(copy);


    SolarForgeDesigner.selectedId =
        copy.id;


    render();


    showToast(
        "Component duplicated",
        "success"
    );

}


/* =========================================================
   DELETE SELECTED
========================================================= */

function deleteSelected() {

    if (
        !SolarForgeDesigner.selectedId
    ) {

        return;

    }


    deleteComponent(
        SolarForgeDesigner.selectedId
    );

}


/* =========================================================
   DELETE COMPONENT
========================================================= */

function deleteComponent(
    componentId
) {

    const component =
        findComponent(
            componentId
        );


    if (!component) {

        return;

    }


    saveHistory();


    SolarForgeDesigner.components =
        SolarForgeDesigner
            .components
            .filter(
                item =>
                    item.id !==
                    componentId
            );


    SolarForgeDesigner.connections =
        SolarForgeDesigner
            .connections
            .filter(
                wire =>
                    wire.from.componentId !==
                        componentId &&
                    wire.to.componentId !==
                        componentId
            );


    if (
        SolarForgeDesigner.selectedId ===
        componentId
    ) {

        SolarForgeDesigner.selectedId =
            null;

    }


    SolarForgeDesigner.pendingPort =
        null;


    render();


    showToast(
        `${component.name} deleted`,
        "info"
    );

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const componentCount =
        document.getElementById(
            "componentCount"
        );


    const connectionCount =
        document.getElementById(
            "connectionCount"
        );


    const pvPowerSummary =
        document.getElementById(
            "pvPowerSummary"
        );


    if (componentCount) {

        componentCount.textContent =
            SolarForgeDesigner
                .components
                .length;

    }


    if (connectionCount) {

        connectionCount.textContent =
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
                (total, component) =>
                    total +
                    Number(
                        component.power || 0
                    ),
                0
            );


    if (pvPowerSummary) {

        pvPowerSummary.textContent =
            formatNumber(
                pvPower
            ) +
            " W";

    }


    const status =
        document.getElementById(
            "canvasStatus"
        );


    if (!status) return;


    if (
        SolarForgeDesigner.components
            .length === 0
    ) {

        status.textContent =
            "Select a material to begin.";

    }
    else if (
        SolarForgeDesigner.pendingPort
    ) {

        status.textContent =
            "Choose a compatible port.";

    }
    else {

        status.textContent =
            "Design editable.";

    }

}


/* =========================================================
   EMPTY STATE
========================================================= */

function updateEmptyState() {

    if (!canvasEmptyState) {

        return;

    }


    canvasEmptyState.style.display =
        SolarForgeDesigner
            .components
            .length === 0
            ? "block"
            : "none";

}


/* =========================================================
   COORDINATES
========================================================= */

function updateCoordinates(
    x,
    y
) {

    const coordinates =
        document.getElementById(
            "canvasCoordinates"
        );


    if (!coordinates) {

        return;

    }


    coordinates.textContent =
        `X: ${Math.round(x)}    Y: ${Math.round(y)}`;

}


/* =========================================================
   UNDO
========================================================= */

function undo() {

    const previous =
        SolarForgeDesigner
            .history
            .pop();


    if (!previous) {

        showToast(
            "Nothing to undo",
            "info"
        );

        return;

    }


    SolarForgeDesigner
        .future
        .push({

            components:
                clone(
                    SolarForgeDesigner
                        .components
                ),

            connections:
                clone(
                    SolarForgeDesigner
                        .connections
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


    showToast(
        "Undo",
        "info"
    );

}


/* =========================================================
   REDO
========================================================= */

function redo() {

    const next =
        SolarForgeDesigner
            .future
            .pop();


    if (!next) {

        showToast(
            "Nothing to redo",
            "info"
        );

        return;

    }


    SolarForgeDesigner
        .history
        .push({

            components:
                clone(
                    SolarForgeDesigner
                        .components
                ),

            connections:
                clone(
                    SolarForgeDesigner
                        .connections
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


    showToast(
        "Redo",
        "info"
    );

}


/* =========================================================
   SAVE DESIGN
========================================================= */

function saveDesign() {

    const data = {

        version:
            2,

        savedAt:
            new Date().toISOString(),

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


/* =========================================================
   LOAD DESIGN
========================================================= */

function loadDesign() {

    const saved =
        localStorage.getItem(
            "solarforge_system_design"
        );


    if (!saved) {

        return;

    }


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
                    (
                        maximum,
                        component
                    ) => {

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


                        if (
                            Number.isFinite(
                                number
                            )
                        ) {

                            return Math.max(
                                maximum,
                                number
                            );

                        }


                        return maximum;

                    },
                    0
                );


        SolarForgeDesigner.nextId =
            maxId + 1;


    }
    catch (error) {

        console.error(
            "Unable to load SolarForge design:",
            error
        );

    }

}


/* =========================================================
   CLEAR DESIGN
========================================================= */

function clearDesign() {

    if (
        !SolarForgeDesigner
            .components
            .length
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Clear the entire design canvas?"
        );


    if (!confirmed) {

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


/* =========================================================
   PANEL COLLAPSE
========================================================= */

function collapseMaterials() {

    materialsPanel.classList.add(
        "collapsed"
    );


    openMaterialsButton.style.display =
        "flex";

}


function openMaterials() {

    materialsPanel.classList.remove(
        "collapsed"
    );


    openMaterialsButton.style.display =
        "none";

}


function collapseProperties() {

    propertiesPanel.classList.add(
        "collapsed"
    );


    openPropertiesButton.style.display =
        "flex";

}


function openProperties() {

    propertiesPanel.classList.remove(
        "collapsed"
    );


    openPropertiesButton.style.display =
        "none";

}


/* =========================================================
   TOOL SETUP
========================================================= */

function setupTools() {


    /* -----------------------------------------
       Select
    ----------------------------------------- */

    document
        .getElementById(
            "selectToolButton"
        )
        .addEventListener(
            "click",
            () => {

                setTool(
                    "select"
                );

            }
        );


    /* -----------------------------------------
       Wire
    ----------------------------------------- */

    document
        .getElementById(
            "wireToolButton"
        )
        .addEventListener(
            "click",
            () => {

                setTool(
                    "wire"
                );

            }
        );


    /* -----------------------------------------
       Delete
    ----------------------------------------- */

    document
        .getElementById(
            "deleteToolButton"
        )
        .addEventListener(
            "click",
            () => {

                setTool(
                    "delete"
                );

            }
        );


    /* -----------------------------------------
       Undo
    ----------------------------------------- */

    document
        .getElementById(
            "undoButton"
        )
        .addEventListener(
            "click",
            undo
        );


    /* -----------------------------------------
       Redo
    ----------------------------------------- */

    document
        .getElementById(
            "redoButton"
        )
        .addEventListener(
            "click",
            redo
        );


    /* -----------------------------------------
       Save
    ----------------------------------------- */

    document
        .getElementById(
            "saveDesignButton"
        )
        .addEventListener(
            "click",
            saveDesign
        );


    /* -----------------------------------------
       Clear
    ----------------------------------------- */

    document
        .getElementById(
            "clearCanvasButton"
        )
        .addEventListener(
            "click",
            clearDesign
        );


    /* -----------------------------------------
       Zoom
    ----------------------------------------- */

    document
        .getElementById(
            "zoomInButton"
        )
        .addEventListener(
            "click",
            () => {

                setZoom(
                    SolarForgeDesigner.zoom +
                    .1
                );

            }
        );


    document
        .getElementById(
            "zoomOutButton"
        )
        .addEventListener(
            "click",
            () => {

                setZoom(
                    SolarForgeDesigner.zoom -
                    .1
                );

            }
        );


    /* -----------------------------------------
       Fit
    ----------------------------------------- */

    document
        .getElementById(
            "fitCanvasButton"
        )
        .addEventListener(
            "click",
            fitCanvas
        );


    /* -----------------------------------------
       Material Search
    ----------------------------------------- */

    document
        .getElementById(
            "materialSearch"
        )
        .addEventListener(
            "input",
            renderMaterials
        );


    /* -----------------------------------------
       Material Filters
    ----------------------------------------- */

    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

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

                    }
                );

            }
        );


    /* -----------------------------------------
       Collapse Materials
    ----------------------------------------- */

    document
        .getElementById(
            "collapseMaterialsButton"
        )
        .addEventListener(
            "click",
            collapseMaterials
        );


    /* -----------------------------------------
       Open Materials
    ----------------------------------------- */

    openMaterialsButton
        .addEventListener(
            "click",
            openMaterials
        );


    /* -----------------------------------------
       Collapse Properties
    ----------------------------------------- */

    document
        .getElementById(
            "collapsePropertiesButton"
        )
        .addEventListener(
            "click",
            collapseProperties
        );


    /* -----------------------------------------
       Open Properties
    ----------------------------------------- */

    openPropertiesButton
        .addEventListener(
            "click",
            openProperties
        );


    /* -----------------------------------------
       Canvas click
    ----------------------------------------- */

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


    /* -----------------------------------------
       Mouse / Touch Coordinates
    ----------------------------------------- */

    canvas.addEventListener(
        "pointermove",
        event => {

            const rect =
                canvas.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                SolarForgeDesigner.zoom;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                SolarForgeDesigner.zoom;


            updateCoordinates(
                x,
                y
            );

        }
    );


    /* -----------------------------------------
       Resize
    ----------------------------------------- */

    window.addEventListener(
        "resize",
        () => {

            renderWires();

        }
    );

}


/* =========================================================
   TOOLS
========================================================= */

function setTool(tool) {

    SolarForgeDesigner.tool =
        tool;


    document
        .querySelectorAll(
            ".tool-button"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    const buttons = {

        select:
            "selectToolButton",

        wire:
            "wireToolButton",

        delete:
            "deleteToolButton"

    };


    document
        .getElementById(
            buttons[tool]
        )
        ?.classList.add(
            "active"
        );


    if (
        tool !==
        "wire"
    ) {

        SolarForgeDesigner.pendingPort =
            null;


        highlightPorts();

    }


    if (
        tool ===
        "wire"
    ) {

        showToast(
            "Wire mode: select a port, then choose a compatible port.",
            "info"
        );

    }


    if (
        tool ===
        "delete"
    ) {

        showToast(
            "Delete mode: select a component to remove it.",
            "info"
        );

    }

}


/* =========================================================
   ZOOM
========================================================= */

function setZoom(
    value
) {

    SolarForgeDesigner.zoom =
        Math.max(
            .7,
            Math.min(
                1.5,
                value
            )
        );


    componentLayer.style.transform =
        `scale(${SolarForgeDesigner.zoom})`;


    componentLayer.style.transformOrigin =
        "0 0";


    wireLayer.style.transform =
        `scale(${SolarForgeDesigner.zoom})`;


    wireLayer.style.transformOrigin =
        "0 0";


    document
        .getElementById(
            "zoomValue"
        )
        .textContent =
            Math.round(
                SolarForgeDesigner.zoom *
                100
            ) +
            "%";


    setTimeout(
        renderWires,
        30
    );

}


/* =========================================================
   FIT CANVAS
========================================================= */

function fitCanvas() {

    setZoom(1);


    canvas.scrollTo({

        left:
            0,

        top:
            0,

        behavior:
            "smooth"

    });


    showToast(
        "Canvas reset to 100%",
        "info"
    );

}


/* =========================================================
   STARTUP
========================================================= */

function initializeDesigner() {

    loadDesign();

    setupTools();

    renderMaterials();

    render();

    /*
     * Start with both panels visible.
     * User can minimize either one.
     */

    openMaterialsButton.style.display =
        "none";

    openPropertiesButton.style.display =
        "none";


    /*
     * Initial zoom.
     */

    setZoom(1);

}


initializeDesigner();
