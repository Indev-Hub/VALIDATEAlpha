import { addDays, endOfDay, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import { mock } from '../lib/axios';
import createResourceId from '../utils/createResourceId';

const cloneDeep = (data) => JSON.parse(JSON.stringify((data)));

const now = new Date();

let events = [
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: false,
    color: '#43a048',
    description: 'Inform about new contract',
    end: setHours(setMinutes(subDays(now, 6), 0), 19),
    start: setHours(setMinutes(subDays(now, 6), 30), 17),
    title: 'Call Samantha'
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: false,
    color: null,
    description: 'Discuss about new partnership',
    end: setHours(setMinutes(addDays(now, 2), 30), 15),
    start: setHours(setMinutes(addDays(now, 2), 0), 12),
    title: 'Meet with IBM'
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: false,
    color: null,
    description: 'Prepare docs',
    end: setHours(setMinutes(addDays(now, 5), 0), 12),
    start: setHours(setMinutes(addDays(now, 5), 0), 8),
    title: 'SCRUM Planning'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    color: null,
    description: 'Meet with team to discuss',
    end: startOfDay(subDays(now, 11)),
    start: endOfDay(subDays(now, 12)),
    title: 'Begin SEM'
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: false,
    color: '#43a048',
    description: 'Sorry, John!',
    end: setHours(setMinutes(addDays(now, 3), 31), 7),
    start: setHours(setMinutes(addDays(now, 3), 30), 7),
    title: 'Fire John'
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: false,
    color: null,
    description: 'Discuss about the new project',
    end: setHours(setMinutes(subDays(now, 6), 30), 9),
    start: setHours(setMinutes(subDays(now, 6), 0), 9),
    title: 'Call Alex'
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: false,
    color: '#43a048',
    description: 'Get a new quote for the payment processor',
    end: setHours(setMinutes(now, 30), 17),
    start: setHours(setMinutes(now, 30), 15),
    title: 'Visit Samantha'
  }
];

mock
  .onGet('/api/calendar/events')
  .reply(200, { events });

mock
  .onPost('/api/calendar/events/new')
  .reply((request) => {
    try {
      const { allDay, description, end, start, title } = JSON.parse(request.data);

      // Make a deep copy
      const clonedEvents = cloneDeep(events);

      // Create the new event
      const event = {
        id: createResourceId(),
        allDay,
        description,
        end,
        start,
        title
      };

      // Add the new event to events
      clonedEvents.push(event);

      // Save changes
      events = clonedEvents;

      return [200, { event }];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });

mock
  .onPost('/api/calendar/events/update')
  .reply((request) => {
    try {
      const { eventId, update } = JSON.parse(request.data);

      // Make a deep copy
      const clonedEvents = cloneDeep(events);

      // Find the event that will be updated
      const event = events.find((_event) => _event.id === eventId);

      if (!event) {
        return [404, 'Event not found'];
      }

      // Update the event
      Object.assign(event, update);

      // Save changes
      events = clonedEvents;

      return [200, { event }];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });

mock
  .onPost('/api/calendar/events/remove')
  .reply((request) => {
    try {
      const { eventId } = JSON.parse(request.data);

      // Make a deep copy
      const clonedEvents = cloneDeep(events);

      // Find the event that will be removed
      const event = events.find((_event) => _event.id === eventId);

      if (!event) {
        return [404, 'Event not found'];
      }

      events = events.filter((_event) => _event.id !== eventId);

      // Save changes
      events = clonedEvents;

      return [200, { eventId }];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });
