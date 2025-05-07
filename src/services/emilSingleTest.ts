import { Data } from "../data.js";
import dotenv from "dotenv";

dotenv.config();

const dataInstance = new Data();
const corridorID = 1;

dataInstance.getDbWaterData(corridorID);

