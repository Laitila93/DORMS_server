/**
 * Schedules and manages periodic tasks using node-cron.
 * 
 * This module initializes three daily cron jobs that run at 8:00 AM (Stockholm time):
 * 1. Updates experience points (XP) for dorms
 * 2. Updates consumption feedback for dorms
 * 3. Updates statistics for dorms
 * 
 * @requires node-cron
 * @requires dotenv
 * @requires ../services/xpUpdateHandler
 * @requires ../services/feedbackUpdateHandler
 * @requires ../services/statsUpdater
 * @requires ../data
 * 
 * @remarks
 * All scheduled tasks are configured to run in the Europe/Stockholm timezone.
 * The dorms data is loaded at initialization and passed to each update handler.
 */
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


cron.schedule('*/9 * * * * *', () => { //This is the one running right now
  console.log('Running score update...');
  updateXP(dorms);
}, {
  scheduled: true,
  timezone: 'Europe/Stockholm'
});



cron.schedule('*/8 * * * * *',() => { //run every minute for testing
  console.log('Running feedback update...');
  updateConsumptionFeedback(dorms);
  }, {
  scheduled: true,
  timezone: 'Europe/Stockholm'
});

cron.schedule('*/7 * * * * *',() => { //run every minute for testing
  console.log('Running stats update...');
  updateStats(dorms);
  }, {
  scheduled: true,
  timezone: 'Europe/Stockholm'
});

