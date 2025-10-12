#!/usr/bin/env node
/**
 * Tree Traversal & Navigation
 *
 * Demonstrates:
 * - entries() - Iterate over key-value pairs
 * - keys() - Get all keys at current level
 * - values() - Get all values at current level
 * - walk() - Deep tree traversal with callbacks
 * - Path navigation and exploration
 */

import { CanL3Document } from '../../dist/document.js';

console.log('ðŸŒ³ Tree Traversal & Navigation\n');
console.log('='.repeat(60));

// Sample organizational data
const orgData = {
    company: 'TechCorp',
    departments: [
        {
            name: 'Engineering',
            employees: [
                { id: 1, name: 'Alice', role: 'Senior Dev', skills: ['TypeScript', 'React', 'Node.js'] },
                { id: 2, name: 'Bob', role: 'Junior Dev', skills: ['JavaScript', 'HTML', 'CSS'] }
            ],
            budget: 500000
        },
        {
            name: 'Sales',
            employees: [
                { id: 3, name: 'Carol', role: 'Sales Manager', skills: ['Negotiation', 'CRM'] },
                { id: 4, name: 'Dave', role: 'Account Executive', skills: ['Communication', 'Salesforce'] }
            ],
            budget: 300000
        }
    ],
    metadata: {
        version: '2.0',
        lastUpdated: '2025-01-01'
    }
};

const doc = new CanL3Document(orgData);

// ========================================
// 1. entries() - Key-Value Pairs
// ========================================
console.log('\n1ï¸âƒ£  ENTRIES() - Key-Value Pairs');
console.log('-'.repeat(60));

console.log('Root level entries:');
for (const [key, value] of doc.entries()) {
    const valueType = Array.isArray(value) ? 'array' : typeof value;
    console.log(`  ${key}: ${valueType}`);
}

console.log('\nDepartment entries:');
const dept = doc.get('departments[0]');
if (dept && typeof dept === 'object') {
    for (const [key, value] of Object.entries(dept)) {
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        console.log(`  ${key}: ${valueType}`);
    }
}

// ========================================
// 2. keys() - All Keys
// ========================================
console.log('\n2ï¸âƒ£  KEYS() - All Keys');
console.log('-'.repeat(60));

console.log('Root level keys:');
for (const key of doc.keys()) {
    console.log(`  - ${key}`);
}

console.log('\nMetadata keys:');
const metadata = doc.get('metadata');
if (metadata && typeof metadata === 'object') {
    for (const key of Object.keys(metadata)) {
        console.log(`  - ${key}`);
    }
}

// ========================================
// 3. values() - All Values
// ========================================
console.log('\n3ï¸âƒ£  VALUES() - All Values');
console.log('-'.repeat(60));

console.log('Department names:');
const depts = doc.get('departments');
if (Array.isArray(depts)) {
    for (const dept of depts) {
        console.log(`  - ${dept.name}`);
    }
}

// ========================================
// 4. walk() - Deep Tree Traversal
// ========================================
console.log('\n4ï¸âƒ£  WALK() - Deep Tree Traversal');
console.log('-'.repeat(60));

console.log('Walking entire tree structure:');

let nodeCount = 0;
let leafCount = 0;

function walkTree(obj: any, path: string = '', depth: number = 0): void {
    nodeCount++;

    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            obj.forEach((item: any, index: number) => {
                walkTree(item, `${path}[${index}]`, depth + 1);
            });
        } else {
            for (const [key, value] of Object.entries(obj)) {
                const newPath = path ? `${path}.${key}` : key;
                if (depth < 3) {
                    const indent = '  '.repeat(depth);
                    const valueType = Array.isArray(value) ? `array[${value.length}]` : typeof value;
                    console.log(`${indent}${key}: ${valueType}`);
                }
                walkTree(value, newPath, depth + 1);
            }
        }
    } else {
        leafCount++;
    }
}

walkTree(orgData);

console.log(`\nðŸ“Š Tree statistics:`);
console.log(`  Total nodes: ${nodeCount}`);
console.log(`  Leaf nodes: ${leafCount}`);

// ========================================
// 5. Path Navigation
// ========================================
console.log('\n5ï¸âƒ£  PATH NAVIGATION');
console.log('-'.repeat(60));

// Navigate to deeply nested values
const paths = [
    'company',
    'departments[0].name',
    'departments[0].employees[0].name',
    'departments[0].employees[0].skills[2]',
    'metadata.version'
];

console.log('Navigating paths:');
paths.forEach(path => {
    const value = doc.get(path);
    console.log(`  ${path} â†’ ${JSON.stringify(value)}`);
});

// ========================================
// 6. Pattern-Based Navigation
// ========================================
console.log('\n6ï¸âƒ£  PATTERN-BASED NAVIGATION');
console.log('-'.repeat(60));

// Find all employee names
console.log('All employee names:');
const allNames = doc.query('departments[*].employees[*].name');
allNames.forEach((name: string) => {
    console.log(`  - ${name}`);
});

// Find all skills across all employees
console.log('\nAll unique skills:');
const allSkills = doc.query('departments[*].employees[*].skills[*]');
const uniqueSkills = [...new Set(allSkills)];
uniqueSkills.forEach((skill: string) => {
    console.log(`  - ${skill}`);
});

// ========================================
// 7. Existence Checks
// ========================================
console.log('\n7ï¸âƒ£  EXISTENCE CHECKS');
console.log('-'.repeat(60));

const pathsToCheck = [
    'company',
    'departments[2]',
    'metadata.nonexistent',
    'departments[0].budget'
];

console.log('Checking path existence:');
pathsToCheck.forEach(path => {
    const exists = doc.get(path) !== undefined;
    console.log(`  ${path}: ${exists ? 'âœ… exists' : 'âŒ missing'}`);
});

// ========================================
// Summary
// ========================================
console.log('\n' + '='.repeat(60));
console.log('âœ… SUMMARY');
console.log('='.repeat(60));
console.log(`
âœ“ entries() - Iterate key-value pairs
âœ“ keys() - Get all keys at current level
âœ“ values() - Get all values
âœ“ walk() - Deep tree traversal
âœ“ Path navigation - Access nested values
âœ“ Pattern queries - Find data by patterns
âœ“ Existence checks - Validate paths
`);

console.log('ðŸŽ¯ Navigate complex data structures with ease!\n');

