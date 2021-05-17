import { createSlice } from '@reduxjs/toolkit';
import axios from '../lib/axios';

const initialState = {
  events: [],
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(state, action) {
      const { events } = action.payload;

      state.events = events;
    },
    createEvent(state, action) {
      const { event } = action.payload;

      state.events.push(event);
    },
    selectEvent(state, action) {
      const { eventId = null } = action.payload;

      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },
    updateEvent(state, action) {
      const { event } = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(state, action) {
      const { eventId } = action.payload;

      state.events = state.events.filter((event) => event.id !== eventId);
    },
    selectRange(state, action) {
      const { start, end } = action.payload;

      state.isModalOpen = true;
      state.selectedRange = {
        start,
        end
      };
    },
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  }
});

export const { reducer } = slice;

export const getEvents = () => async (dispatch) => {
  const response = await axios.get('/api/calendar/events');

  dispatch(slice.actions.getEvents(response.data));
};

export const createEvent = (data) => async (dispatch) => {
  const response = await axios.post('/api/calendar/events/new', data);

  dispatch(slice.actions.createEvent(response.data));
};

export const selectEvent = (eventId) => async (dispatch) => {
  dispatch(slice.actions.selectEvent({ eventId }));
};

export const updateEvent = (eventId, update) => async (dispatch) => {
  const response = await axios.post('/api/calendar/events/update', {
    eventId,
    update
  });

  dispatch(slice.actions.updateEvent(response.data));
};

export const deleteEvent = (eventId) => async (dispatch) => {
  await axios.post('/api/calendar/events/remove', {
    eventId
  });

  dispatch(slice.actions.deleteEvent({ eventId }));
};

export const selectRange = (start, end) => (dispatch) => {
  dispatch(slice.actions.selectRange({
    start: start.getTime(),
    end: end.getTime()
  }));
};

export const openModal = () => (dispatch) => {
  dispatch(slice.actions.openModal());
};

export const closeModal = () => (dispatch) => {
  dispatch(slice.actions.closeModal());
};

export default slice;
