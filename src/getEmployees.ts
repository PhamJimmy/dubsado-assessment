import { TreeNode } from "./manageEmployees";

// https://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript
/**
 * Helper function to get employee node via recursion
 * 
 * @param {TreeNode} treeNode
 * @param {string} bossName
 * @returns {TreeNode} boss
 */
export function getEmployee(treeNode: TreeNode, name: string) {
  if (treeNode.value.name === name) return treeNode;
  if (treeNode.descendants.length) {
    let employee: TreeNode = null;
    for (let i = 0; i < treeNode.descendants.length && !employee; i++) {
      employee = getEmployee(treeNode.descendants[i], name);
    }
    return employee;
  }
  return null;
} 

/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
export function getBoss(tree: TreeNode, employeeName: string) {
  if (tree.descendants.map((descendant) => descendant.value.name).find(name => name === employeeName)) return tree;
  if (tree.descendants.length) {
    let boss: TreeNode = null;
    for (let i = 0; i < tree.descendants.length && !boss; i++) {
      boss = getBoss(tree.descendants[i], employeeName);
    }
    return boss;
  }
  return null;
}

/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
export function getSubordinates(tree: TreeNode, employeeName: string) {
  if (tree.value.name === employeeName) return tree.descendants;
  if (tree.descendants.length) {
    let subordinates: TreeNode[] = null;
    for (let i = 0; i < tree.descendants.length && !subordinates; i++) {
      subordinates = getSubordinates(tree.descendants[i], employeeName);
    }
    return subordinates;
  }
  return null;
}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 * 
 * @param {TreeNode} tree
 * @returns {TreeNode: number} 
 */
export function findLowestEmployee(tree: TreeNode) {
  const lowestEmployee = getLowestLeaf(tree);
  const depth = getDepth(tree);
  return { lowestEmployee, depth };
}

function getDepth(tree: TreeNode, count: number = 1): number {
  return 1 + Math.max(0, ...tree.descendants.map((descendant) => getDepth(descendant)));
}

function getLowestLeaf(tree: TreeNode) {
  if (!tree.descendants.length) return tree;
  let queue = [...tree.descendants];
  let lastLeaf: TreeNode = null;
  while(queue.length){
    if (queue[0].descendants.length) {
      queue = [...queue, ...queue[0].descendants];
    }
    lastLeaf = queue.shift();
  }
  return lastLeaf;
}

export function getPathToLowestEmployee(tree: TreeNode) {
  let path = [];
  const lowestEmployee = getLowestLeaf(tree);
  path.push(lowestEmployee.value.name);

  let boss = getBoss(tree, path[0]);

  while(boss) {
    path.unshift(boss.value.name);
    boss = getBoss(tree, path[0]);
  }
  
  return path;
}