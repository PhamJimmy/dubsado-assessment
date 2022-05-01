# Dubsado Developer Assessment

In this project, I utilized Node and Typescript to build an employee management system via the Tree data structure.

## Running the app

- Use `yarn` or `yarn install` to install all the dependencies needed for this program
- Use `yarn start` to run the program by building/compiling the Typescript files to Javascript and subsequently running the Javascript build files

## Logic and Styling Decisions

- The printing/console.log logic of the manageEmployees file was added into the functions themselves instead of the index file. This allows for less flexibility, and may print even when not needed, but keeps the index file cleaner in the long run.
- getEmployees did not have printing/console.log logic added into the functions because these functions were frequently called within manageEmployees, and would result in too many messages/spam.
- All search functions utilized the Depth First Traversals via In-Order Traversal. There was no critical reason why this was chosen, except the conscious choice to practice recursion.

## Possible Improvements

- Breadth First Traversal would probably be more efficient for finding nodes near the top. getBoss would have been a great opportunity to try this traversal method out.
- Slice methods are repeated a lot. Practice DRY. Could probably implement that the logic in its own function.
- After switching certain nodes' positions in the tree, the values (jobTitle, salary, boss) would most likely be switched also, in a more true-to-life scenario.


## Time Complexities
- `generateCompanyStructure`
  - O(n^2)
  - Iterates through n employees. Each employee iteration will then also call hireEmployees, which will then traverse the tree for another O(n) time.
- `hireEmployee`
  - O(n)
  - Traverses through the tree for maximum of n nodes/employees.
- `fireEmployee`
  - O(2n) ~ O(n)
  - Traverses through the tree twice, once for the employee and once for the boss for O(n) time each. There are also several iterations through subordinates but time complexity will be dominated by n time. n will always be greater than the descendant arrays within each nodes.
  - **Possible Improvement**: Only traverse the tree once to find the boss, then use the boss's tree to obtain the subordinate's tree instead of traversing the entire tree again.
- `promoteEmployee`
  - Same as `fireEmployee`
- `demoteEmployee`
  - Same as `fireEmployee`
- `getBoss`
  - O(n)
  - Traverses through the entire tree until a match is found
  - **Possible Improvements**: Use Breadth-First-Traversal since bosses might be found higher up in the tree.
- `getSubordinates`
  - Same as `getBoss`

## Similar Functions
The functions `promoteEmployee` and `demoteEmployee` have the same logic. The biggest difference is the additional parameter that `demoteEmployee` takes in.