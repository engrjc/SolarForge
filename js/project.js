// ========================================
// SolarForge Project / Site Survey Module
// ========================================


// ========================================
// OPEN NEW PROJECT
// ========================================

function openNewProject() {

    document.getElementById("dashboardPage").style.display = "none";

    document.getElementById("databasePage").style.display = "none";

    document.getElementById("projectPage").style.display = "block";

    setActiveButton("project");

    loadSavedProject();

}


// ========================================
// CLOSE PROJECT
// ========================================

function closeProject() {

    document.getElementById("projectPage").style.display = "none";

    document.getElementById("dashboardPage").style.display = "block";

    setActiveButton("dashboard");

}


// ========================================
// SAVE PROJECT
// ========================================

function saveProject() {

    const project = {

        projectId:
            document.getElementById("projectId").value.trim(),

        projectName:
            document.getElementById("projectName").value.trim(),

        customerName:
            document.getElementById("customerName").value.trim(),

        contactNumber:
            document.getElementById("contactNumber").value.trim(),

        email:
            document.getElementById("customerEmail").value.trim(),

        address:
            document.getElementById("siteAddress").value.trim(),

        installationType:
            document.getElementById("installationType").value,

        roofType:
            document.getElementById("roofType").value,

        electricalService:
            document.getElementById("electricalService").value,

        gridConnection:
            document.getElementById("gridConnection").value,

        notes:
            document.getElementById("siteNotes").value.trim(),

        createdAt:
            new Date().toISOString()

    };


    // ====================================
    // REQUIRED FIELD CHECK
    // ====================================

    if (!project.projectName) {

        alert("Please enter a project name.");

        document
            .getElementById("projectName")
            .focus();

        return;

    }


    if (!project.customerName) {

        alert("Please enter the customer name.");

        document
            .getElementById("customerName")
            .focus();

        return;

    }


    // ====================================
    // SAVE PROJECT
    // ====================================

    localStorage.setItem(
        "solarforge_current_project",
        JSON.stringify(project)
    );


    // ====================================
    // CONFIRMATION
    // ====================================

    alert(
        "Project saved successfully.\n\n" +
        "Project: " +
        project.projectName +
        "\nCustomer: " +
        project.customerName
    );


    console.log(
        "SolarForge Project:",
        project
    );

}


// ========================================
// LOAD SAVED PROJECT
// ========================================

function loadSavedProject() {

    const saved =
        localStorage.getItem(
            "solarforge_current_project"
        );


    if (!saved) {

        return;

    }


    try {

        const project =
            JSON.parse(saved);


        document.getElementById("projectId").value =
            project.projectId || "";


        document.getElementById("projectName").value =
            project.projectName || "";


        document.getElementById("customerName").value =
            project.customerName || "";


        document.getElementById("contactNumber").value =
            project.contactNumber || "";


        document.getElementById("customerEmail").value =
            project.email || "";


        document.getElementById("siteAddress").value =
            project.address || "";


        document.getElementById("installationType").value =
            project.installationType || "";


        document.getElementById("roofType").value =
            project.roofType || "";


        document.getElementById("electricalService").value =
            project.electricalService || "";


        document.getElementById("gridConnection").value =
            project.gridConnection || "";


        document.getElementById("siteNotes").value =
            project.notes || "";


        console.log(
            "SolarForge saved project loaded:",
            project
        );


    }

    catch (error) {

        console.error(
            "Unable to load saved project:",
            error
        );

    }

}
