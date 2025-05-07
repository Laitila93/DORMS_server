import cron from 'node-cron';
import dotenv from "dotenv";
import { updateXP } from '../services/xpUpdateHandler.js';
import { updateConsumptionFeedback } from '../services/feedbackUpdateHandler.js';

dotenv.config();

/** 
cron.schedule('* * * * *',() => { 
  console.log('Running score update...');
  updateXP(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});
*/

cron.schedule('*/15 * * * * *',() => { //run every 15 seconds for testing
  console.log('Running feedback update...');
  updateConsumptionFeedback(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});

