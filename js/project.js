// ========================================
// SolarForge Project / Site Survey Module
// ========================================

function openNewProject() {

    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("databasePage").style.display = "none";
    document.getElementById("projectPage").style.display = "block";

    setActiveButton("project");

}


// ========================================
// SHOW DASHBOARD
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
            document.getElementById("projectId").value,

        projectName:
            document.getElementById("projectName").value,

        customerName:
            document.getElementById("customerName").value,

        contactNumber:
            document.getElementById("contactNumber").value,

        email:
            document.getElementById("customerEmail").value,

        address:
            document.getElementById("siteAddress").value,

        installationType:
            document.getElementById("installationType").value,

        roofType:
            document.getElementById("roofType").value,

        electricalService:
            document.getElementById("electricalService").value,

        gridConnection:
            document.getElementById("gridConnection").value,

        notes:
            document.getElementById("siteNotes").value,

        createdAt:
            new Date().toISOString()

    };


    // Basic validation

    if (!project.projectName) {

        alert("Please enter a project name.");

        return;

    }


    if (!project.customerName) {

        alert("Please enter the customer name.");

        return;

    }


    // Save locally for now

    localStorage.setItem(
        "solarforge_current_project",
        JSON.stringify(project)
    );


    alert(
        "Project saved successfully.\n\n" +
        "Project: " + project.projectName
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


    }

    catch (error) {

        console.error(
            "Unable to load saved project:",
            error
        );

    }

}
