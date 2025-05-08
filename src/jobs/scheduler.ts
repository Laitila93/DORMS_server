import cron from 'node-cron';
import dotenv from "dotenv";
import { updateXP } from '../services/xpUpdateHandler.js';
import { updateConsumptionFeedback } from '../services/feedbackUpdateHandler.js';
import { updateStats } from '../services/statsUpdater.js'
import { Data } from "../data.js"

dotenv.config();

const data = new Data();
let dorms = await data.getDorms();
console.log("Dorms: ", dorms);


cron.schedule('* * * * *',() => { 
  console.log('Running score update...');
  updateXP(dorms),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});


cron.schedule('* * * * *',() => { //run every minute for testing
  console.log('Running feedback update...');
  updateConsumptionFeedback(dorms),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});

cron.schedule('* * * * *',() => { //run every minute for testing
  console.log('Running stats update...');
  updateStats(dorms),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});

