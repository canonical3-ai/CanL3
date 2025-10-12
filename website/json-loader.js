// JSON Loader for Examples
async function loadJSONExample(filename) {
    try {
        const response = await fetch(`json/${filename}.json`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        const data = await response.json();
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}
