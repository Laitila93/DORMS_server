import cron from 'node-cron';
import dotenv from "dotenv";
import { updateXP } from '../services/xpUpdateHandler.js';

dotenv.config();


cron.schedule('*/2 * * * * *',() => { //run every two seconds for testing
  console.log('Running score update...');
  updateXP(),

  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});
/* 
cron.schedule('* * * * *',() => { //run every minute for testing
  console.log('Running feedback update...'),
  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});
*/
