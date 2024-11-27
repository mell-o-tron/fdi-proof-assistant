const fs = require('fs');
const path = require('path');

// Ensure folders exist or create them
const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Function to write individual JSON files
const writeJsonFile = (folder, name, content) => {
  const filePath = path.join(folder, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  return filePath;
};

const main = () => {
  // Read the input JSON file
  const inputFilePath = process.argv[2];
  if (!inputFilePath) {
    console.error('Please provide the input JSON file path as the first argument.');
    process.exit(1);
  }

  const inputFileName = path.basename(inputFilePath, '.json');
  const inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

  // Prepare output directories
  const definitionsDir = './definitions';
  const theoremsDir = './theorems';
  const tacticsDir = './tactics';
  ensureDirectory(definitionsDir);
  ensureDirectory(theoremsDir);
  ensureDirectory(tacticsDir);

  // Arrays to store the names of generated JSON files
  const generatedDefinitions = [];
  const generatedTheorems = [];
  const generatedTactics = [];

  // Process definitions
  inputData.definitions.forEach((definition) => {
    const fileName = `${definition.name}`;
    const theorems = inputData.theorems.filter(x => x.name.startsWith(definition.name) && x.name.endsWith("clause"));
    const filePath = writeJsonFile(definitionsDir, fileName, { definition, theorems });
    generatedDefinitions.push(filePath);
  });

  // Process theorems
  inputData.theorems.forEach((theorem) => {
    if (!theorem.name.endsWith("clause")) {
      const fileName = `${theorem.name}`;
      const filePath = writeJsonFile(theoremsDir, fileName, theorem);
      generatedTheorems.push(filePath);
    }
  });

  // Process tactics
  inputData.tactics.forEach((tactic) => {
    const fileName = `${tactic.name}`;
    const filePath = writeJsonFile(tacticsDir, fileName, tactic);
    generatedTactics.push(filePath);
  });

  // Write the summary JSON file
  const summaryFilePath = `./topic_summaries/${inputFileName}.json`;
  const summaryContent = {
    extra: [],
    definitions: generatedDefinitions.map((file) => path.basename(file)),
    theorems: generatedTheorems.map((file) => path.basename(file)),
    tactics: generatedTactics.map((file) => path.basename(file)),
  };

  fs.writeFileSync(summaryFilePath, JSON.stringify(summaryContent, null, 2), 'utf-8');
  console.log(`Summary file written to ${summaryFilePath}`);
};

// Run the script
main();

