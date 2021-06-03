import { subHours, subDays } from 'date-fns';
import { mock } from '../lib/axios';

const now = new Date();

mock
  .onGet('/api/validations')
  .reply(() => {
    const validations = {
        logoId: '4',
        reason: 'The colors remind me of my childhood'
      }

    return [200, { validations }];
  });

mock
  .onGet('/api/validations/1')
  .reply(() => {
    const validation = {
      logoId: '4',
      id: '5ecb86785312dcc69b5799ad',
      currency: '$',
      customer: {
        address: '271 Richmond Rd, Grey Lynn, Auckland 1022, New Zealand',
        company: 'Countdown Grey Lynn',
        email: 'contact@anahenisky.io',
        name: 'Ana Henisky',
        taxId: '6934656584231'
      },
      dueDate: now.getTime(),
      issueDate: subHours(now, 1).getTime(),
      items: [
        {
          id: '5ecb8694db1760a701dfbf74',
          currency: '$',
          description: 'Freelancer Subscription (12/05/2019 - 11/06/2019)',
          unitAmount: 55.50
        }
      ],
      number: 'DEV-9483',
      status: 'paid',
      subtotalAmount: 50.00,
      taxAmount: 5.50,
      totalAmount: 55.50
    };

    return [200, { validation }];
  });
