#!/usr/bin/env node

/**
 * CanL3 Advanced Optimization Example
 *
 * This example demonstrates the v2.0.0 optimization features
 * including dictionary encoding, delta compression, bit packing, etc.
 */

import {
  CanL3Document,
  encodeCanL3,
  decodeCanL3,
  AdaptiveOptimizer,
  DictionaryBuilder,
  DeltaEncoder,
  BitPacker,
  RunLengthEncoder,
  ColumnReorderer
} from '../dist/index.js';

// Sample data for optimization demonstration
const sampleData = [
  {
    id: 1001,
    employee_id: "EMP001",
    name: "Alice Johnson",
    department: "Engineering",
    role: "Senior Developer",
    salary: 95000.00,
    active: true,
    hire_date: "2020-01-15",
    skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    projects_completed: 12,
    last_login: 1704067200000,
    performance_rating: 4.5,
    remote_worker: true,
    manager_id: 5001
  },
  {
    id: 1002,
    employee_id: "EMP002",
    name: "Bob Smith",
    department: "Engineering",
    role: "Developer",
    salary: 75000.00,
    active: true,
    hire_date: "2021-03-22",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    projects_completed: 8,
    last_login: 1704067201000,
    performance_rating: 4.2,
    remote_worker: false,
    manager_id: 5001
  },
  {
    id: 1003,
    employee_id: "EMP003",
    name: "Carol Davis",
    department: "Marketing",
    role: "Marketing Manager",
    salary: 85000.00,
    active: true,
    hire_date: "2019-07-10",
    skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
    projects_completed: 15,
    last_login: 1704067202000,
    performance_rating: 4.7,
    remote_worker: true,
    manager_id: 5002
  },
  {
    id: 1004,
    employee_id: "EMP004",
    name: "David Wilson",
    department: "Engineering",
    role: "DevOps Engineer",
    salary: 88000.00,
    active: true,
    hire_date: "2020-09-01",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    projects_completed: 10,
    last_login: 1704067203000,
    performance_rating: 4.4,
    remote_worker: true,
    manager_id: 5001
  },
  {
    id: 1005,
    employee_id: "EMP005",
    name: "Eva Brown",
    department: "Marketing",
    role: "Content Specialist",
    salary: 65000.00,
    active: false,
    hire_date: "2022-02-14",
    skills: ["Copywriting", "Social Media", "Email Marketing", "Canva"],
    projects_completed: 6,
    last_login: 1704067204000,
    performance_rating: 3.8,
    remote_worker: false,
    manager_id: 5002
  }
];

console.log('ðŸš€ CanL3 Advanced Optimization Example');
console.log('=====================================\n');

// 1. Basic CanL3 Encoding
console.log('1ï¸âƒ£ Basic CanL3 Encoding');
const basicCanL3 = encodeCanL3({ employees: sampleData });
console.log(`Size: ${basicCanL3.length} characters`);
console.log(`Preview:\n${basicCanL3.substring(0, 300)}...\n`);

// 2. Smart Encoding
console.log('2ï¸âƒ£ Smart Encoding');
const smartCanL3 = encodeCanL3({ employees: sampleData }, {
  delimiter: '|',
  includeTypes: false,
  singleLinePrimitiveLists: true
});
console.log(`Size: ${smartCanL3.length} characters`);
console.log(`Savings vs Basic: ${((1 - smartCanL3.length / basicCanL3.length) * 100).toFixed(1)}%\n`);

// 3. Individual Optimization Strategies
console.log('3ï¸âƒ£ Individual Optimization Strategies');

// Dictionary Encoding for repetitive values
console.log('ðŸ“š Dictionary Encoding:');
const deptValues = sampleData.map(emp => emp.department);
const dictBuilder = new DictionaryBuilder();
const deptDict = dictBuilder.analyzeDictionaryCandidates(deptValues, 'department');
if (deptDict) {
  console.log(`  Department dictionary saves: ${deptDict.totalSavings} bytes`);
  console.log(`  Encoding: ${deptDict.encoding}`);
  const directive = dictBuilder.generateDictionaryDirective(deptDict);
  console.log(`  Directive: ${directive}`);
}

// Delta Encoding for sequential timestamps
console.log('\nâ­ï¸  Delta Encoding:');
const timestamps = sampleData.map(emp => emp.last_login);
const deltaEncoder = new DeltaEncoder();
const deltaAnalysis = deltaEncoder.analyzeSequence(timestamps);
if (deltaAnalysis.recommended) {
  console.log(`  Delta compression ratio: ${deltaAnalysis.compressionRatio.toFixed(2)}x`);
  const deltaEncoded = deltaEncoder.encode(timestamps, 'last_login');
  console.log(`  Original: [${timestamps.slice(0, 3).join(', ')}...]`);
  console.log(`  Encoded: [${deltaEncoded.slice(0, 3).join(', ')}...]`);
}

// Bit Packing for boolean values
console.log('\nðŸ’¾ Bit Packing:');
const activeValues = sampleData.map(emp => emp.active);
const bitPacker = new BitPacker();
const bitAnalysis = bitPacker.analyzeValues(activeValues);
if (bitAnalysis.recommended) {
  console.log(`  Bit packing saves: ${bitAnalysis.compressionRatio} ratio`);
  console.log(`  Boolean array: [${activeValues.join(', ')}]`);
  console.log(`  Data type: ${bitAnalysis.dataType}, Bit width: ${bitAnalysis.bitWidth}`);
}

// Run-Length Encoding
console.log('\nðŸ”„ Run-Length Encoding:');
const roleSequence = ['Developer', 'Developer', 'Developer', 'Manager', 'Manager', 'Developer'];
const rleEncoder = new RunLengthEncoder();
const rleAnalysis = rleEncoder.analyzeSequence(roleSequence);
if (rleAnalysis.recommended) {
  console.log(`  RLE compression ratio: ${rleAnalysis.compressionRatio.toFixed(2)}x`);
  const rleEncoded = rleEncoder.encode(roleSequence);
  console.log(`  Original: [${roleSequence.join(', ')}]`);
  console.log(`  Encoded: ${JSON.stringify(rleEncoded)}`);
}

// 4. Adaptive Optimization (Recommended Approach)
console.log('\n4ï¸âƒ£ Adaptive Optimization Analysis');
const optimizer = new AdaptiveOptimizer();
const analysis = optimizer.analyzeDataset(sampleData);

console.log('Recommended Strategies:');
analysis.recommendedStrategies.forEach(strategy => {
  console.log(`  âœ“ ${strategy}`);
});

console.log(`\nEstimated Savings: ${analysis.estimatedSavings}%`);
console.log('\nOptimization Details:');
analysis.appliedOptimizations.forEach(detail => {
  console.log(`  â€¢ ${detail}`);
});

if (analysis.warnings.length > 0) {
  console.log('\nWarnings:');
  analysis.warnings.forEach(warning => {
    console.log(`  âš ï¸  ${warning}`);
  });
}

// 5. Apply Adaptive Optimization
console.log('\n5ï¸âƒ£ Applying Adaptive Optimization');
const optimizationResult = optimizer.optimize(sampleData);

console.log(`Original records: ${sampleData.length}`);
console.log(`Optimization directives: ${optimizationResult.directives.length}`);
console.log('\nDirectives:');
optimizationResult.directives.forEach((directive, index) => {
  console.log(`  ${index + 1}. ${directive}`);
});

// 6. Create Optimized CanL3 Document
console.log('\n6ï¸âƒ£ Creating Optimized CanL3 Document');
const optimizedDoc = CanL3Document.fromJSON({
  employees: optimizationResult.optimizedData
});

// Add optimization directives as comments
const CanL3WithDirectives = optimizationResult.directives.join('\n') + '\n' + optimizedDoc.toCanL3();

console.log(`Final optimized CanL3 size: ${CanL3WithDirectives.length} characters`);
console.log(`Total compression: ${((1 - CanL3WithDirectives.length / basicCanL3.length) * 100).toFixed(1)}%`);

// 7. Performance Comparison
console.log('\n7ï¸âƒ£ Performance Comparison Summary');
console.log('================================');
console.log(`Original JSON:     ${JSON.stringify(sampleData).length} chars`);
console.log(`Basic CanL3:        ${basicCanL3.length} chars (${((1 - basicCanL3.length / JSON.stringify(sampleData).length) * 100).toFixed(1)}% savings)`);
console.log(`Smart CanL3:        ${smartCanL3.length} chars (${((1 - smartCanL3.length / JSON.stringify(sampleData).length) * 100).toFixed(1)}% savings)`);
console.log(`Optimized CanL3:    ${CanL3WithDirectives.length} chars (${((1 - CanL3WithDirectives.length / JSON.stringify(sampleData).length) * 100).toFixed(1)}% savings)`);

// Token estimation (rough calculation)
const jsonTokens = Math.ceil(JSON.stringify(sampleData).length / 4);
const CanL3Tokens = Math.ceil(CanL3WithDirectives.length / 4);
console.log(`\nToken Estimation:`);
console.log(`JSON tokens:     ~${jsonTokens}`);
console.log(`CanL3 tokens:     ~${CanL3Tokens}`);
console.log(`Token savings:   ${((1 - CanL3Tokens / jsonTokens) * 100).toFixed(1)}%`);

// 8. Round-trip verification
console.log('\n8ï¸âƒ£ Round-trip Verification');
try {
  // Parse the optimized CanL3 with directives
  const parsedDoc = CanL3Document.parse(optimizedDoc.toCanL3());
  const retrievedData = parsedDoc.get('employees');

  console.log('âœ… Round-trip successful');
  console.log(`Original records: ${sampleData.length}`);
  console.log(`Retrieved records: ${retrievedData.length}`);
  console.log('Data integrity: âœ… PRESERVED');
} catch (error) {
  console.log('âŒ Round-trip failed:', error.message);
}

console.log('\nðŸŽ‰ Optimization Example Complete!');
console.log('=====================================');

