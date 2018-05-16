const moment = require('moment-timezone');
const knex = require('./../services/knex');
const uuidv4 = require('uuid/v4');

module.exports = {
  bookAppointment
};

async function bookAppointment(req, res, next) {
  try {
    const { name, serviceType, store } = req.body;

    let appointment = {
      account__c: store,
      external_id__c: uuidv4(),
      type__c: serviceType,
      customer_name__c: name,
      status__c: 'Waiting'
    };

    if (serviceType === 'New Service') {
      const leadExternalId = uuidv4();
      await knex('salesforce.lead').insert({
        lastname: name,
        company: 't-mobile',
        external_id__c: leadExternalId,
        status: 'Open - Not Contacted'
      });

      appointment = Object.assign(appointment, {
        lead__r__external_id__c: leadExternalId
      });
    }

    await knex('salesforce.appointment__c').insert(appointment);

    return res.json({
      message: 'Your appointment has been booked.'
    });
  } catch (error) {
    next(error);
  }
}
