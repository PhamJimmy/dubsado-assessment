import { employees as db } from "./employees.json";
import { getEmployee, getBoss } from "./getEmployees";

interface Employee {
  name: string;
  jobTitle: string;
  salary: string;
  boss: string;
}

export class TreeNode {
  value: Employee;
  descendants: TreeNode[];

  constructor(value: Employee) {
    this.value = value;
    this.descendants = [];
  }
}

/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param {Employee[]} employees array of employees
 * @returns {TreeNode}
 */
export function generateCompanyStructure(employees: Employee[]) {
  console.log("Generating employee tree...");

  // Creates root via CEO information
  const companyRoot = new TreeNode(employees[0]);
  employees.splice(1).forEach((employee: Employee) => {
    hireEmployee(companyRoot, employee, employee.boss);
  });

  return companyRoot;
}

/**
 * Helper function that normalizes names provided in the JSON file
 *
 * @returns {employee[]}
 */
export function generateNormalizedJSON() {
  console.log("Normalizing JSON file...");

  const normalizedEmployees = db.map((employee) => {
    let newName: string = employee.name.split("@")[0];
    newName = newName[0].toUpperCase() + newName.slice(1);
    employee.name = newName;
    return employee;
  });

  return normalizedEmployees;
}

/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {TreeNode} tree
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */
export function hireEmployee(tree: TreeNode, newEmployee: Employee, bossName: string) {
  const boss = getFutureBoss(tree, bossName);
  const employee = new TreeNode(newEmployee);
  boss.descendants.push(employee);
  console.log(`[hireEmployee]: Added new employee (${employee.value.name}) with ${boss.value.name} as their boss`);
}

// https://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
/**
 * Helper function for hireEmployee to get boss node via recursion
 *
 * @param {TreeNode} treeNode
 * @param {string} bossName
 * @returns {TreeNode} boss
 */
function getFutureBoss(treeNode: TreeNode, bossName: string) {
  if (treeNode.value.name === bossName) return treeNode;

  if (treeNode.descendants.length) {
    let boss: TreeNode = null;
    for (let i = 0; i < treeNode.descendants.length && !boss; i++) {
      boss = getFutureBoss(treeNode.descendants[i], bossName);
    }
    return boss;
  }

  return null;
}

/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * PSEUDOCODE
 * get firedEmployee from tree
 * if firedEmployee descendants array is populated:
 *  select a random subordinate as replacement
 *  remove replacement from firedEmployee's subordinates
 *  all firedEmployee subordinates must point to replacement as parent node
 *  replacement must add firedEmployee subordinates to descendants
 *  replacement adds firedEmployee's boss to parent node
 *  parent/boss node adds replacement into descendants
 * parent/boss node should find index of firedEmployee in descendants and remove it
 *
 * @param {TreeNode} tree
 * @param {string} name employee's name
 * @returns {void}
 */
export function fireEmployee(tree: TreeNode, name: string) {
  const employee = getEmployee(tree, name);
  const subordinates = employee.descendants;
  const boss = getBoss(tree, name);

  let replacement = new TreeNode(null);
  if (subordinates.length) {
    replacement = subordinates[Math.floor(Math.random() * subordinates.length)];

    subordinates.splice(
      subordinates.findIndex((subordinate) => subordinate.value.name === replacement.value.name),
      1
    );

    for (let subordinate of subordinates) {
      replacement.descendants.push(subordinate);
    }
    boss.descendants.push(replacement);
  }

  boss.descendants.splice(
    boss.descendants.findIndex((descendant) => descendant.value.name === name),
    1
  );
  console.log(`[fireEmployee]: Fired ${employee.value.name} and replaced with ${replacement.value.name}`);
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * PSEUDOCODE
 * get promotedEmployee from tree
 * boss removes promotedEmployee from subordinates
 * save boss's subordinates via DEEP COPY
 * promotedEmployee adds boss's subordinates
 * if promotedEmployee has subordinates:
 *  promotedEmployee subordinate must point to promotedEmployee's boss as new parent
 *  boss adds promotedEmployee subordinates to their own
 *  promotedEmployee deletes all subordinates
 * promotedEmployee adds boss as subordinate
 * boss's boss adds promotedEmployee to descendants
 * boss's boss will point to employee
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {void}
 */
export function promoteEmployee(tree: TreeNode, employeeName: string) {
  const employee: TreeNode = getEmployee(tree, employeeName);
  const boss: TreeNode = getBoss(tree, employeeName);

  boss.descendants.splice(
    boss.descendants.findIndex((subordinate) => subordinate.value.name === employeeName),
    1
  );

  // temporary DEEP COPY, by value and not by reference since we want ORIGINAL values
  const bossSubordinates = JSON.parse(JSON.stringify(boss.descendants));
  const employeeSubordinates = JSON.parse(JSON.stringify(employee.descendants));
  employee.descendants = bossSubordinates;
  boss.descendants = employeeSubordinates;


  const superBoss = getBoss(tree, boss.value.name);
  const bossIndex = superBoss.descendants.findIndex((descendant) => descendant.value.name === boss.value.name);
  superBoss.descendants[bossIndex] = employee;
  employee.descendants.push(boss);
  console.log(`[promoteEmployee]: Promoted ${employee.value.name} and made ${boss.value.name} their subordinate`);
}

/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinate and swaps places in the hierarchy.
 *
 * SIMILAR TO PROMOTEEMPLOYEE FUNCTION!!!
 *
 * @param {TreeNode} tree
 * @param {string} employeeName the employee getting demoted
 * @param {string} subordinateName the new boss
 * @returns {void}
 */
export function demoteEmployee(tree: TreeNode, employeeName: string, subordinateName: string) {
  const employee = getEmployee(tree, employeeName);
  const subordinate = getEmployee(tree, subordinateName);

  employee.descendants.splice(
    employee.descendants.findIndex((subordinate) => subordinate.value.name === subordinateName),
    1
  );

  // DEEP COPY, by value and not by reference since we want ORIGINAL values
  const employeeSubordinates = JSON.parse(JSON.stringify(employee.descendants));
  const subordinateSubordinates = JSON.parse(JSON.stringify(subordinate.descendants));
  employee.descendants = subordinateSubordinates;
  subordinate.descendants = employeeSubordinates;

  const superBoss = getBoss(tree, employee.value.name);
  const bossIndex = superBoss.descendants.findIndex((descendant) => descendant.value.name === employee.value.name);
  superBoss.descendants[bossIndex] = subordinate;

  subordinate.descendants = employeeSubordinates;
  subordinate.descendants.push(employee);
  console.log(`[demoteEmployee]: Demoted employee (demoted ${employee.value.name} and replaced with ${subordinate.value.name})`);
}
