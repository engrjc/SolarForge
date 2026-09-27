// ========================================
// SolarForge Load Analysis Module
// ========================================


let solarForgeLoads = [];


// ========================================
// OPEN LOAD ANALYSIS
// ========================================

function openLoadAnalysis() {

    hideAllPages();

    document
        .getElementById("loadAnalysisPage")
        .style.display = "block";

    setActiveButton("loadAnalysis");

    loadSavedLoadAnalysis();

    calculateLoadAnalysis();

}


// ========================================
// CLOSE LOAD ANALYSIS
// ========================================

function closeLoadAnalysis() {

    document
        .getElementById("loadAnalysisPage")
        .style.display = "none";

    document
        .getElementById("dashboardPage")
        .style.display = "block";

    setActiveButton("dashboard");

}


// ========================================
// ADD LOAD ROW
// ========================================

function addLoadRow(load = {}) {

    const loadId =
        Date.now() +
        Math.floor(Math.random() * 1000);


    const newLoad = {

        id: loadId,

        name:
            load.name || "",

        category:
            load.category || "General",

        quantity:
            Number(load.quantity) || 1,

        power:
            Number(load.power) || 0,

        hours:
            Number(load.hours) || 0,

        days:
            Number(load.days) || 30,

        priority:
            load.priority || "Essential"

    };


    solarForgeLoads.push(newLoad);


    renderLoadTable();

    calculateLoadAnalysis();

}


// ========================================
// RENDER LOAD TABLE
// ========================================

function renderLoadTable() {

    const tbody =
        document.getElementById(
            "loadTableBody"
        );


    tbody.innerHTML = "";


    if (
        solarForgeLoads.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#8491a3;
                    ">

                    No loads added yet.
                    Click <strong>+ Add Load</strong>
                    to begin.

                </td>

            </tr>

        `;

        return;

    }


    solarForgeLoads.forEach(
        function(load) {

            const dailyEnergy =
                (
                    load.quantity *
                    load.power *
                    load.hours
                ) / 1000;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <input
                        type="text"
                        value="${escapeHTML(load.name)}"
                        placeholder="Example: Refrigerator"
                        onchange="
                            updateLoad(
                                ${load.id},
                                'name',
                                this.value
                            )
                        ">

                </td>


                <td>

                    <select
                        onchange="
                            updateLoad(
                                ${load.id},
                                'category',
                                this.value
                            )
                        ">

                        <option
                            value="General"
                            ${load.category === "General" ? "selected" : ""}>
                            General
                        </option>

                        <option
                            value="Lighting"
                            ${load.category === "Lighting" ? "selected" : ""}>
                            Lighting
                        </option>

                        <option
                            value="Cooling"
                            ${load.category === "Cooling" ? "selected" : ""}>
                            Cooling
                        </option>

                        <option
                            value="Refrigeration"
                            ${load.category === "Refrigeration" ? "selected" : ""}>
                            Refrigeration
                        </option>

                        <option
                            value="Kitchen"
                            ${load.category === "Kitchen" ? "selected" : ""}>
                            Kitchen
                        </option>

                        <option
                            value="Entertainment"
                            ${load.category === "Entertainment" ? "selected" : ""}>
                            Entertainment
                        </option>

                        <option
                            value="Office"
                            ${load.category === "Office" ? "selected" : ""}>
                            Office
                        </option>

                        <option
                            value="Water Pump"
                            ${load.category === "Water Pump" ? "selected" : ""}>
                            Water Pump
                        </option>

                        <option
                            value="Motor"
                            ${load.category === "Motor" ? "selected" : ""}>
                            Motor
                        </option>

                        <option
                            value="Other"
                            ${load.category === "Other" ? "selected" : ""}>
                            Other
                        </option>

                    </select>

                </td>


                <td>

                    <input
                        type="number"
                        min="1"
                        value="${load.quantity}"
                        onchange="
                            updateLoad(
                                ${load.id},
                                'quantity',
                                this.value
                            )
                        ">

                </td>


                <td>

                    <input
                        type="number"
                        min="0"
                        value="${load.power}"
                        onchange="
                            updateLoad(
                                ${load.id},
                                'power',
                                this.value
                            )
                        ">

                </td>


                <td>

                    <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value="${load.hours}"
                        onchange="
                            updateLoad(
                                ${load.id},
                                'hours',
                                this.value
                            )
                        ">

                </td>


                <td>

                    <input
                        type="number"
                        min="1"
                        max="31"
                        value="${load.days}"
                        onchange="
                            updateLoad(
                                ${load.id},
                                'days',
                                this.value
                            )
                        ">

                </td>


                <td>

                    <select
                        onchange="
                            updateLoad(
                                ${load.id},
                                'priority',
                                this.value
                            )
                        ">

                        <option
                            value="Essential"
                            ${load.priority === "Essential" ? "selected" : ""}>
                            Essential
                        </option>

                        <option
                            value="Non-Essential"
                            ${load.priority === "Non-Essential" ? "selected" : ""}>
                            Non-Essential
                        </option>

                    </select>

                </td>


                <td class="energy-cell">

                    ${dailyEnergy.toFixed(2)}
                    kWh

                </td>


                <td class="delete-cell">

                    <button
                        class="delete-btn"
                        onclick="
                            deleteLoad(${load.id})
                        ">

                        Delete

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// ========================================
// UPDATE LOAD
// ========================================

function updateLoad(
    id,
    field,
    value
) {

    const load =
        solarForgeLoads.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!load) {

        return;

    }


    if (
        field === "quantity" ||
        field === "power" ||
        field === "hours" ||
        field === "days"
    ) {

        value =
            Number(value);


        if (
            isNaN(value) ||
            value < 0
        ) {

            value = 0;

        }

    }


    load[field] =
        value;


    renderLoadTable();

    calculateLoadAnalysis();

}


// ========================================
// DELETE LOAD
// ========================================

function deleteLoad(id) {

    solarForgeLoads =
        solarForgeLoads.filter(
            function(load) {

                return load.id !== id;

            }
        );


    renderLoadTable();

    calculateLoadAnalysis();

}


// ========================================
// CALCULATE LOAD ANALYSIS
// ========================================

function calculateLoadAnalysis() {

    let connectedLoad = 0;

    let dailyEnergy = 0;

    let monthlyEnergy = 0;

    let essentialLoad = 0;


    solarForgeLoads.forEach(
        function(load) {

            const loadPower =
                load.quantity *
                load.power;


            const loadDailyEnergy =
                (
                    load.quantity *
                    load.power *
                    load.hours
                ) / 1000;


            const loadMonthlyEnergy =
                loadDailyEnergy *
                load.days;


            connectedLoad +=
                loadPower;


            dailyEnergy +=
                loadDailyEnergy;


            monthlyEnergy +=
                loadMonthlyEnergy;


            if (
                load.priority ===
                "Essential"
            ) {

                essentialLoad +=
                    loadPower;

            }

        }
    );


    document
        .getElementById(
            "totalConnectedLoad"
        )
        .textContent =
        formatNumber(
            connectedLoad
        ) +
        " W";


    document
        .getElementById(
            "totalDailyEnergy"
        )
        .textContent =
        dailyEnergy.toFixed(2) +
        " kWh";


    document
        .getElementById(
            "totalMonthlyEnergy"
        )
        .textContent =
        monthlyEnergy.toFixed(2) +
        " kWh";


    document
        .getElementById(
            "totalEssentialLoad"
        )
        .textContent =
        formatNumber(
            essentialLoad
        ) +
        " W";


    return {

        connectedLoad:
            connectedLoad,

        dailyEnergy:
            dailyEnergy,

        monthlyEnergy:
            monthlyEnergy,

        essentialLoad:
            essentialLoad

    };

}


// ========================================
// SAVE LOAD ANALYSIS
// ========================================

function saveLoadAnalysis() {

    const analysis =
        calculateLoadAnalysis();


    const project =
        localStorage.getItem(
            "solarforge_current_project"
        );


    const projectData =
        project
            ? JSON.parse(project)
            : null;


    const loadAnalysis = {

        projectId:
            projectData
                ? projectData.projectId
                : "",

        projectName:
            projectData
                ? projectData.projectName
                : "",

        loads:
            solarForgeLoads,

        summary:
            analysis,

        savedAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "solarforge_load_analysis",
        JSON.stringify(loadAnalysis)
    );


    alert(
        "Load analysis saved successfully.\n\n" +

        "Connected Load: " +
        formatNumber(
            analysis.connectedLoad
        ) +
        " W\n" +

        "Daily Energy: " +
        analysis.dailyEnergy.toFixed(2) +
        " kWh/day\n" +

        "Monthly Energy: " +
        analysis.monthlyEnergy.toFixed(2) +
        " kWh/month"
    );


    console.log(
        "SolarForge Load Analysis:",
        loadAnalysis
    );

}


// ========================================
// LOAD SAVED ANALYSIS
// ========================================

function loadSavedLoadAnalysis() {

    const saved =
        localStorage.getItem(
            "solarforge_load_analysis"
        );


    if (!saved) {

        if (
            solarForgeLoads.length === 0
        ) {

            addDefaultLoads();

        }

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        if (
            Array.isArray(data.loads)
        ) {

            solarForgeLoads =
                data.loads;

        }


        renderLoadTable();

        calculateLoadAnalysis();


    }

    catch (error) {

        console.error(
            "Unable to load saved load analysis:",
            error
        );


        addDefaultLoads();

    }

}


// ========================================
// DEFAULT LOADS
// ========================================

function addDefaultLoads() {

    solarForgeLoads = [

        {

            id: 1,

            name:
                "Refrigerator",

            category:
                "Refrigeration",

            quantity:
                1,

            power:
                150,

            hours:
                10,

            days:
                30,

            priority:
                "Essential"

        },

        {

            id: 2,

            name:
                "LED Lights",

            category:
                "Lighting",

            quantity:
                10,

            power:
                10,

            hours:
                5,

            days:
                30,

            priority:
                "Essential"

        },

        {

            id: 3,

            name:
                "Television",

            category:
                "Entertainment",

            quantity:
                1,

            power:
                100,

            hours:
                5,

            days:
                30,

            priority:
                "Non-Essential"

        }

    ];


    renderLoadTable();

    calculateLoadAnalysis();

}


// ========================================
// CLEAR LOAD ANALYSIS
// ========================================

function clearLoadAnalysis() {

    const confirmed =
        confirm(
            "Clear all loads from this analysis?"
        );


    if (!confirmed) {

        return;

    }


    solarForgeLoads = [];


    localStorage.removeItem(
        "solarforge_load_analysis"
    );


    renderLoadTable();

    calculateLoadAnalysis();

}


// ========================================
// FORMAT NUMBER
// ========================================

function formatNumber(number) {

    return Number(number).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderLoadTable();

        calculateLoadAnalysis();

    }
);
