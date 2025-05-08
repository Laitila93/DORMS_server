import cron from 'node-cron';
import dotenv from "dotenv";
import { updateXP } from '../services/xpUpdateHandler.js';
import { updateConsumptionFeedback } from '../services/feedbackUpdateHandler.js';
import { updateStats } from '../services/statsUpdater.js'

dotenv.config();

 /* PASSIVATED until we're connected to client and can test everything /Emil
cron.schedule('* * * * *',() => { 
  console.log('Running score update...');
  updateXP(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});


cron.schedule('* * * * *',() => { //run every minute for testing
  console.log('Running feedback update...');
  updateConsumptionFeedback(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});

cron.schedule('* * * * *',() => { //run every minute for testing
  console.log('Running stats update...');
  updateStats(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});
*/

