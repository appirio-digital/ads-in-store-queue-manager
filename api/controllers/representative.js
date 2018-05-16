const moment = require('moment-timezone');

const knex = require('./../services/knex');

module.exports = {
  attendCustomer,
  closeCustomerRequest
};

async function attendCustomer(req, res, next) {
  try {
    const { appointment, representative } = req.body;

    if (!appointment || !representative) {
      next(new Error('Required parameter missing.'));
    }

    const timeNow = moment.utc(new Date());

    const result = await knex('salesforce.appointment__c')
      .where('sfid', appointment)
      .update({
        status__c: 'In-Progress',
        representative__c: representative,
        start_time__c: timeNow
      })
      .returning('*');

    return res.json({
      result: result[0],
      message: 'Your appointment has been booked.'
    });
  } catch (error) {
    next(error);
  }
}

async function closeCustomerRequest(req, res, next) {
  try {
    const { appointment, comment } = req.body;

    if (!appointment) {
      next(new Error('Required parameter missing.'));
    }

    const timeNow = moment.utc(new Date());

    const result = await knex('salesforce.appointment__c')
      .where('sfid', appointment)
      .update({
        status__c: 'Complete',
        end_time__c: timeNow,
        comment__c: comment
      })
      .returning('*');

    return res.json({
      result: result[0],
      message: 'Your appointment has been booked.'
    });
  } catch (error) {
    next(error);
  }
}
