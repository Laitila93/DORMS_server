import cron from 'node-cron';

cron.schedule('*/2 * * * * *',() => { //run every minute for testing
  console.log('Running score update...'),
  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});

cron.schedule('*/2 * * * * *',() => { //run every minute for testing
  console.log('Running feedback update...'),
  {scheduled: true,
  timezone: 'Europe/Stockholm'
  }
});
