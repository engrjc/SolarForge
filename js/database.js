// SolarForge Database Loader

const SolarForgeDB = {
    solarPanels: [],
    hybridInverters: [],
    batteries: [],
    cables: [],
    protection: [],
    mounting: [],
    accessories: []
};

// Load a JSON database file
async function loadDatabase(filePath) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Unable to load ${filePath}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Database loading error:", error);
        return [];
    }
}

// Load all SolarForge databases
async function loadAllDatabases() {

    SolarForgeDB.solarPanels =
        await loadDatabase("database/solar-panels.json");

    SolarForgeDB.hybridInverters =
        await loadDatabase("database/hybrid-inverters.json");

    SolarForgeDB.batteries =
        await loadDatabase("database/batteries.json");

    SolarForgeDB.cables =
        await loadDatabase("database/cables.json");

    SolarForgeDB.protection =
        await loadDatabase("database/protection.json");

    SolarForgeDB.mounting =
        await loadDatabase("database/mounting.json");

    SolarForgeDB.accessories =
        await loadDatabase("database/accessories.json");

    console.log("SolarForge databases loaded successfully.");

    console.log("Solar Panels:",
        SolarForgeDB.solarPanels.length);

    console.log("Hybrid Inverters:",
        SolarForgeDB.hybridInverters.length);

    console.log("Batteries:",
        SolarForgeDB.batteries.length);

    console.log("Cables:",
        SolarForgeDB.cables.length);

    console.log("Protection:",
        SolarForgeDB.protection.length);

    console.log("Mounting:",
        SolarForgeDB.mounting.length);

    console.log("Accessories:",
        SolarForgeDB.accessories.length);
}

// Start database loading
loadAllDatabases();
