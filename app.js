const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {BedrockClient,
  ListFoundationModelsCommand}  = require("@aws-sdk/client-bedrock")

//require configs
require("./config/database")
require("./models/userModels")

//require modules
const userRouter = require("./routes/userRouter")
const authRouter = require("./routes/authRouter")
const SSEManager = require("./sseManager")


const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.get("/",(req,res)=>res.send("Welcome !"))
const REGION = "us-east-1";
const client = new BedrockClient({ region: REGION,
    credentials: ({ profile: 'ignyte-sandbox' }),maxAttempts: 1

 });

  const command = new ListFoundationModelsCommand({});
 
var aws = async ()=>{
  const response =  await client.send(command);
  const models = response.modelSummaries;

  console.log("Listing the available Bedrock foundation models:");

  for (const model of models) {
    console.log("=".repeat(42));
    console.log(` Model: ${model.modelId}`);
    console.log("-".repeat(42));
    console.log(` Name: ${model.modelName}`);
    console.log(` Provider: ${model.providerName}`);
    console.log(` Model ARN: ${model.modelArn}`);
    console.log(` Input modalities: ${model.inputModalities}`);
    console.log(` Output modalities: ${model.outputModalities}`);
    console.log(` Supported customizations: ${model.customizationsSupported}`);
    console.log(` Supported inference types: ${model.inferenceTypesSupported}`);
    console.log(` Lifecycle status: ${model.modelLifecycle.status}`);
    console.log(`${"=".repeat(42)}\n`);
  }

  const active = models.filter(
    (m) => m.modelLifecycle.status === "ACTIVE",
  ).length;
  const legacy = models.filter(
    (m) => m.modelLifecycle.status === "LEGACY",
  ).length;

  console.log(
    `There are ${active} active and ${legacy} legacy foundation models in ${REGION}.`,
  );
}
 aws();



let counter = 0;
let clsTIme;
app.get("/sse/:userId", (req, res) => {
  console.log("hello sse")
  SSEManager.connect(req.params.userId, res);
  SSEManager.send(req.params.userId, "connected", {
    message: "SSE Connected"
  });
  SSEManager.start(req.params.userId, "task-1", "Task started");
   clsTIme = setInterval(() => {
    console.log("setinterval ........")
    SSEManager.progress(req.params.userId, "task-1", counter=counter+10);
  }, 2000);

  setTimeout(() => {counter=0;
    console.log("settimeout ........")
    SSEManager.complete(req.params.userId, "task-1", 900);
    SSEManager.disconnect(req.params.userId, "task-1", "Task started");
    clearInterval(clsTIme);
  }, 1000*20);


  // req.on("close", () => {

  //       console.log("Client disconnected");

  //       clearInterval(clsTIme);

  //       SSEManager.disconnect(req.params.userId);

  //   });
  //res.send("SSE connection established");
});


app.listen(8000,()=>console.log("Server running on port 8000"))
