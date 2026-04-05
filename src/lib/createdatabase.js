import { faker, Faker } from "@faker-js/faker";
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = [];

for (let i = 1; i <= 15; i++) {
  data.push({
    amount: faker.number.int({ min: 100, max: 10000 }),
    type: faker.helpers.arrayElement(["income", "expense"]),
    category: faker.helpers.arrayElement([
      "salary",
      "food",
      "travel",
      "rent",
      "shopping",
      "health",
      "entertainment"
    ]),
    date: faker.date.past().toISOString(),
    notes: faker.lorem.sentence(),
  });
}
const folderPath = path.join(__dirname, "../sampledata");
if(!fs.existsSync(folderPath)){
    fs.mkdirSync("./src/sampledata")
}
const filepath = path.join(folderPath,"transaction.json")
fs.writeFileSync(filepath,JSON.stringify(data,null,2));