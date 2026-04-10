import { Stagehand } from "@browserbasehq/stagehand";
import dotenv from "dotenv";

dotenv.config();
// WARNING: The previously provided OpenAI API key EXCEEDED ITS QUOTA.
// Using a placeholder below; replace with an active, funded API key.
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "sk-UPDATE_WITH_CREDITED_KEY";

async function runTest() {
  console.log("🚀 Initializing Stagehand MULTI-AGENT Browser Test (Visible Mode)...");  

  // Setup Student Agent
  const student = new Stagehand({
    env: "LOCAL",
    headless: false,
    logger: (msg) => console.log("[🧒 Student Agent]: " + msg.message)
  });

  // Setup Teacher/Mentor Agent
  const teacher = new Stagehand({
    env: "LOCAL",
    headless: false,
    logger: (msg) => console.log("[🧑‍🏫 Teacher Agent]: " + msg.message)
  });

  try {
    // 1. Initialize both agents in parallel
    console.log("Launching two separate local Chrome browser windows...");
    await Promise.all([student.init(), teacher.init()]);

    const studentPage = student.page || student.context?.pages()[0];
    const teacherPage = teacher.page || teacher.context?.pages()[0];

    // 2. Both agents navigate to the UI concurrently
    console.log("Agents navigating to http://localhost:8080/register in parallel...");
    await Promise.all([
      studentPage.goto("http://localhost:8080/register"),
      teacherPage.goto("http://localhost:8080/login") // Teacher goes to login instead
    ]);

    await new Promise(r => setTimeout(r, 3000)); // give DOM time to load

    // 3. Autonomous Vision Interactions
    console.log("Agents attempting autonomous form interactions via Vision AI...");    
    const studentTask = student.act("Find the name, email, and password input fields. Enter 'Student Bot' for name, 'student@test.com' for email, and 'Pass123!' for password. Then click the register button.");
    const teacherTask = teacher.act("Find the login email and password input fields. Enter 'teacher@test.com' for email, and 'Pass123!' for password. Then click the login button.");

    // Execute concurrently so they both type on their respective browsers at the same time
    await Promise.all([studentTask, teacherTask]);

    console.log("✅ Agents successfully navigated the UI.");

  } catch (error: any) {
    console.error("\n❌ MULTI-AGENT TEST FAILED:", error.message || error);
    console.log("\nIf you see a Quota Exceeded error, your OpenAI API key ran out of credits. Stagehand requires LLMs to see and click the page.");
  } finally {
    console.log("\nHolding both browsers open for 15 seconds so you can see them, then closing...");
    setTimeout(async () => {
      await Promise.all([student.close(), teacher.close()]);
      console.log("Browsers cleanly closed.");

runTest();
