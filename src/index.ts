// Main code goes here
import { getBoss, getSubordinates } from "./getEmployees";
import { generateNormalizedJSON, generateCompanyStructure, hireEmployee, fireEmployee, promoteEmployee, demoteEmployee } from "./manageEmployees";

function main() {
  const employees = generateNormalizedJSON();
  const tree = generateCompanyStructure(employees);

  const newEmployee = {
    name: "Jeb",
    jobTitle: "Chauffeur",
    salary: "99999",
    boss: "Sarah"
  }

  console.log("\n");

  console.log(hireEmployee(tree, newEmployee, "Sarah"));
  fireEmployee(tree, "Alicia");
  promoteEmployee(tree, "Jared");
  demoteEmployee(tree, "Xavier", "Maria");

  console.log("\n");

  console.log(`Bill's boss is ${getBoss(tree, "Bill").value.name}`);
  const subordinateNames = getSubordinates(tree, "Maria").map((subordinate) => subordinate.value.name);
  console.log(`Maria's subordinates are ${subordinateNames.join(", ")}`)
}

main()

/** EXPECTED OUTPUT
 * Normalizing JSON file...
Generating employee tree...

[hireEmployee]: Added new employee (Jeb) with Sarah as their boss
[fireEmployee]: Fired Alicia and replaced with Sal
[promoteEmployee]: Promoted Jared and made Bill his subordinate
[demoteEmployee]: Demoted employee (demoted Xavier and replaced with Maria)

[getBoss]: Bill's boss is Jared
[getSubordinate]: Maria's subordinates are Xavier, Morty, Jared
 */