module.exports = {
  chat: {
    id: 1,
    lobby_id: 1,
    host_id: 2,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: [
      {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        single_use_password: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true,
        updated_at: '2020-12-10T22:29:11.638Z',
        is_muted: false,
        is_present: true
      },
      {
        id: 4,
        username: 'credible-lyrebird',
        personalname: null,
        email: null,
        is_anonymous: true,
        single_use_password: false,
        roles: ['participant', 'facilitator'],
        is_super: false,
        updated_at: '2020-12-10T17:50:19.074Z',
        is_muted: false,
        is_present: true
      }
    ],
    usersById: {
      '999': {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        single_use_password: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true,
        updated_at: '2020-12-10T22:29:11.638Z',
        is_muted: false,
        is_present: true
      },
      '4': {
        id: 4,
        username: 'credible-lyrebird',
        personalname: null,
        email: null,
        is_anonymous: true,
        single_use_password: false,
        roles: ['participant', 'facilitator'],
        is_super: false,
        updated_at: '2020-12-10T17:50:19.074Z',
        is_muted: false,
        is_present: true
      }
    }
  },
  chats: [
    {
      id: 1,
      lobby_id: 1,
      host_id: 2,
      created_at: '2020-12-08T21:51:33.659Z',
      updated_at: null,
      deleted_at: null,
      ended_at: null
    }
  ],
  chatsById: {
    '1': {
      id: 1,
      lobby_id: 1,
      host_id: 2,
      created_at: '2020-12-08T21:51:33.659Z',
      updated_at: null,
      deleted_at: null,
      ended_at: null
    }
  },
  cohort: {
    id: 2,
    created_at: '2020-02-31T14:01:02.656Z',
    updated_at: null,
    deleted_at: null,
    is_archived: false,
    name: 'A New Cohort That Exists In Bootstrap State For Testing',
    runs: [],
    scenarios: [],
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        roles: ['super', 'facilitator'],
        is_anonymous: false,
        is_super: true
      }
    ],
    roles: ['super', 'facilitator'],
    usersById: {
      '999': {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        roles: ['super', 'facilitator'],
        is_anonymous: false,
        is_super: true
      }
    }
  },
  cohorts: [
    {
      id: 2,
      name: 'A New Cohort That Exists In Bootstrap State For Testing',
      created_at: '2020-02-31T14:01:02.656Z',
      updated_at: null,
      deleted_at: null,
      is_archived: false,
      runs: [],
      scenarios: [],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      ],
      usersById: {
        '999': {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      }
    },
    {
      id: 1,
      name: 'First Cohort',
      created_at: '2020-03-24T14:52:28.429Z',
      updated_at: null,
      deleted_at: null,
      is_archived: false,
      runs: [
        {
          id: 11,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-28T19:44:03.069Z',
          updated_at: '2020-03-31T17:01:43.139Z',
          ended_at: '2020-03-31T17:01:43.128Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 11
        },
        {
          id: 28,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:01:52.902Z',
          updated_at: '2020-03-31T17:02:00.309Z',
          ended_at: '2020-03-31T17:02:00.296Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 28
        },
        {
          id: 29,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:02:51.357Z',
          updated_at: '2020-03-31T17:02:57.054Z',
          ended_at: '2020-03-31T17:02:57.043Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 29
        },
        {
          id: 30,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:05:34.501Z',
          updated_at: '2020-03-31T17:05:39.144Z',
          ended_at: '2020-03-31T17:05:39.136Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 30
        },
        {
          id: 31,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:07:15.447Z',
          updated_at: '2020-03-31T17:07:20.331Z',
          ended_at: '2020-03-31T17:07:20.321Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 31
        }
      ],
      scenarios: [7, 1, 9, 8],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      ],
      usersById: {
        '999': {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      }
    }
  ],
  cohortsById: {
    '1': {
      id: 1,
      name: 'First Cohort',
      created_at: '2020-03-24T14:52:28.429Z',
      updated_at: null,
      deleted_at: null,
      is_archived: false,
      runs: [
        {
          id: 28,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:01:52.902Z',
          updated_at: '2020-03-31T17:02:00.309Z',
          ended_at: '2020-03-31T17:02:00.296Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 28
        },
        {
          id: 29,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:02:51.357Z',
          updated_at: '2020-03-31T17:02:57.054Z',
          ended_at: '2020-03-31T17:02:57.043Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 29
        },
        {
          id: 30,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:05:34.501Z',
          updated_at: '2020-03-31T17:05:39.144Z',
          ended_at: '2020-03-31T17:05:39.136Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 30
        },
        {
          id: 31,
          user_id: 2,
          scenario_id: 7,
          created_at: '2020-03-31T17:07:15.447Z',
          updated_at: '2020-03-31T17:07:20.331Z',
          ended_at: '2020-03-31T17:07:20.321Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 31
        }
      ],
      scenarios: [7, 1, 9, 8],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      ],
      usersById: {
        '999': {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      }
    },
    '2': {
      id: 2,
      name: 'A New Cohort That Exists In Bootstrap State For Testing',
      created_at: '2020-02-31T14:01:02.656Z',
      updated_at: null,
      deleted_at: null,
      is_archived: false,
      runs: [],
      scenarios: [],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      ],
      usersById: {
        '999': {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true
        }
      }
    }
  },
  errors: {
    cohort: null,
    cohortdata: null,
    cohortlink: null,
    cohorts: null,
    response: null,
    run: null,
    runs: null,
    scenario: null,
    scenarios: null,
    slides: null,
    transcript: null,
    user: null,
    users: null
  },
  history: {
    prompts: [],
    responses: []
  },
  session: {
    isLoggedIn: true,
    username: 'super',
    permissions: [
      'create_cohort',
      'edit_scenarios_in_cohort',
      'view_scenarios_in_cohort',
      'edit_own_cohorts',
      'view_all_cohorts',
      'view_own_cohorts',
      'view_all_data',
      'view_consented_data',
      'view_invited_cohorts',
      'view_own_data',
      'edit_all_cohorts',
      'create_scenario',
      'edit_scenario',
      'edit_permissions',
      'view_run_data',
      'view_all_run_data'
    ],
    personalname: 'Super User',
    email: 'super@email.com',
    id: 2,
    roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
    is_anonymous: false,
    is_super: true
  },
  logs: [
    {
      id: 885,
      created_at: '2020-01-01T00:51:05.143Z',
      capture: {
        request: {
          url: '/runs/116/update',
          body: {
            ended_at: '2020-01-01T00:51:05.116Z'
          },
          query: {},
          method: 'POST',
          params: {},
          headers: {
            host: 'localhost:3000',
            cookie:
              '_ga=GA1.1.585879633.1536761668; connect.sid=s%3AcwNKX0lbxVQLmVrxdn5_GQNrxBSBqjjw.HGR5DGKA%2BlDKy72mK1BCvQLiOb3mYBCBL5XNFNQxMFk',
            origin: 'http://localhost:3000',
            referer: 'http://localhost:3000/run/8/slide/2',
            connection: 'close',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            'content-type': 'application/json',
            'content-length': '39',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
          },
          session: {
            user: {
              id: 999,
              email: 'super@email.com',
              roles: [
                'participant',
                'super_admin',
                'facilitator',
                'researcher'
              ],
              is_super: true,
              username: 'super',
              is_anonymous: false,
              personalname: 'Super User'
            },
            cookie: {
              path: '/',
              expires: '2020-05-12T00:51:05.142Z',
              httpOnly: true,
              originalMaxAge: 2592000000
            }
          }
        },
        response:
          '{"run":{"id":116,"user_id":2,"scenario_id":8,"created_at":"2020-01-01T00:50:30.425Z","updated_at":"2020-01-01T00:51:05.138Z","ended_at":"2020-01-01T00:51:05.116Z","consent_id":1,"consent_acknowledged_by_user":true,"consent_granted_by_user":true,"referrer_params":null},"status":200}'
      }
    },
    {
      id: 884,
      created_at: '2020-01-01T00:50:42.232Z',
      capture: {
        request: {
          url: '/runs/116/response/be18ddc1-7e06-496c-9f33-42bfe6ac05b9',
          body: {
            type: 'TextResponse',
            value: 'sdfsdfsdfsdf',
            isSkip: false,
            content: '',
            ended_at: '2020-01-01T00:50:35.645Z',
            created_at: '2020-01-01T00:50:34.648Z'
          },
          query: {},
          method: 'POST',
          params: {},
          headers: {
            host: 'localhost:3000',
            cookie:
              '_ga=GA1.1.585879633.1536761668; connect.sid=s%3AcwNKX0lbxVQLmVrxdn5_GQNrxBSBqjjw.HGR5DGKA%2BlDKy72mK1BCvQLiOb3mYBCBL5XNFNQxMFk',
            origin: 'http://localhost:3000',
            referer: 'http://localhost:3000/run/8/slide/1',
            connection: 'close',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            'content-type': 'application/json',
            'content-length': '152',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
          },
          session: {
            user: {
              id: 999,
              email: 'super@email.com',
              roles: [
                'participant',
                'super_admin',
                'facilitator',
                'researcher'
              ],
              is_super: true,
              username: 'super',
              is_anonymous: false,
              personalname: 'Super User'
            },
            cookie: {
              path: '/',
              expires: '2020-05-12T00:50:42.232Z',
              httpOnly: true,
              originalMaxAge: 2592000000
            }
          }
        }
      }
    }
  ],
  logsById: {
    '884': {
      id: 884,
      created_at: '2020-01-01T00:50:42.232Z',
      capture: {
        request: {
          url: '/runs/116/response/be18ddc1-7e06-496c-9f33-42bfe6ac05b9',
          body: {
            type: 'TextResponse',
            value: 'sdfsdfsdfsdf',
            isSkip: false,
            content: '',
            ended_at: '2020-01-01T00:50:35.645Z',
            created_at: '2020-01-01T00:50:34.648Z'
          },
          query: {},
          method: 'POST',
          params: {},
          headers: {
            host: 'localhost:3000',
            cookie:
              '_ga=GA1.1.585879633.1536761668; connect.sid=s%3AcwNKX0lbxVQLmVrxdn5_GQNrxBSBqjjw.HGR5DGKA%2BlDKy72mK1BCvQLiOb3mYBCBL5XNFNQxMFk',
            origin: 'http://localhost:3000',
            referer: 'http://localhost:3000/run/8/slide/1',
            connection: 'close',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            'content-type': 'application/json',
            'content-length': '152',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
          },
          session: {
            user: {
              id: 999,
              email: 'super@email.com',
              roles: [
                'participant',
                'super_admin',
                'facilitator',
                'researcher'
              ],
              is_super: true,
              username: 'super',
              is_anonymous: false,
              personalname: 'Super User'
            },
            cookie: {
              path: '/',
              expires: '2020-05-12T00:50:42.232Z',
              httpOnly: true,
              originalMaxAge: 2592000000
            }
          }
        }
      }
    },
    '885': {
      id: 885,
      created_at: '2020-01-01T00:51:05.143Z',
      capture: {
        request: {
          url: '/runs/116/update',
          body: {
            ended_at: '2020-01-01T00:51:05.116Z'
          },
          query: {},
          method: 'POST',
          params: {},
          headers: {
            host: 'localhost:3000',
            cookie:
              '_ga=GA1.1.585879633.1536761668; connect.sid=s%3AcwNKX0lbxVQLmVrxdn5_GQNrxBSBqjjw.HGR5DGKA%2BlDKy72mK1BCvQLiOb3mYBCBL5XNFNQxMFk',
            origin: 'http://localhost:3000',
            referer: 'http://localhost:3000/run/8/slide/2',
            connection: 'close',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            'content-type': 'application/json',
            'content-length': '39',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
          },
          session: {
            user: {
              id: 999,
              email: 'super@email.com',
              roles: [
                'participant',
                'super_admin',
                'facilitator',
                'researcher'
              ],
              is_super: true,
              username: 'super',
              is_anonymous: false,
              personalname: 'Super User'
            },
            cookie: {
              path: '/',
              expires: '2020-05-12T00:51:05.142Z',
              httpOnly: true,
              originalMaxAge: 2592000000
            }
          }
        },
        response:
          '{"run":{"id":116,"user_id":2,"scenario_id":8,"created_at":"2020-01-01T00:50:30.425Z","updated_at":"2020-01-01T00:51:05.138Z","ended_at":"2020-01-01T00:51:05.116Z","consent_id":1,"consent_acknowledged_by_user":true,"consent_granted_by_user":true,"referrer_params":null},"status":200}'
      }
    }
  },
  persona: {
    author_id: null,
    color: '',
    created_at: null,
    deleted_at: null,
    description: '',
    id: null,
    is_read_only: false,
    is_shared: false,
    name: '',
    updated_at: null
  },
  personas: [
    {
      id: 1,
      name: 'Participant',
      description:
        'The default user participating in a single person scenario.',
      color: '#FFFFFF',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 2,
      name: 'Teacher',
      description:
        'A non-specific teacher, participating in a multi person scenario.',
      color: '#3f59a9',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 3,
      name: 'Student',
      description:
        'A non-specific student, participating in a multi person scenario.',
      color: '#e59235',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 4,
      name: 'Facilitator',
      description:
        'A non-specific facilitator, leading participation in a multi person scenario.',
      color: '#73b580',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    }
  ],
  personasById: {
    '1': {
      id: 1,
      name: 'Participant',
      description:
        'The default user participating in a single person scenario.',
      color: '#FFFFFF',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    '2': {
      id: 2,
      name: 'Teacher',
      description:
        'A non-specific teacher, participating in a multi person scenario.',
      color: '#3f59a9',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    '3': {
      id: 3,
      name: 'Student',
      description:
        'A non-specific student, participating in a multi person scenario.',
      color: '#e59235',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    '4': {
      id: 4,
      name: 'Facilitator',
      description:
        'A non-specific facilitator, leading participation in a multi person scenario.',
      color: '#73b580',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    }
  },
  response: {},
  responses: [],
  responsesById: {},
  run: {
    id: 60,
    user_id: 2,
    scenario_id: 42,
    created_at: '2020-09-01T15:59:39.571Z',
    updated_at: '2020-09-01T15:59:47.121Z',
    ended_at: null,
    consent_id: 57,
    consent_acknowledged_by_user: true,
    consent_granted_by_user: true,
    referrer_params: null
  },
  runs: [
    {
      id: 31,
      run_id: 31,
      run_created_at: '2020-03-31T17:07:15.447Z',
      run_ended_at: '2020-03-31T17:07:20.321Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    {
      id: 30,
      run_id: 30,
      run_created_at: '2020-03-31T17:05:34.501Z',
      run_ended_at: '2020-03-31T17:05:39.136Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    {
      id: 29,
      run_id: 29,
      run_created_at: '2020-03-31T17:02:51.357Z',
      run_ended_at: '2020-03-31T17:02:57.043Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    {
      id: 28,
      run_id: 28,
      run_created_at: '2020-03-31T17:01:52.902Z',
      run_ended_at: '2020-03-31T17:02:00.296Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    }
  ],
  runsById: {
    '27': {
      id: 27,
      run_id: 27,
      run_created_at: '2020-03-31T16:59:42.363Z',
      run_ended_at: '2020-03-31T16:59:49.447Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: null,
      scenario_id: 29,
      scenario_title: 'New COPY COPY',
      scenario_description: '',
      user_id: 2
    },
    '28': {
      id: 28,
      run_id: 28,
      run_created_at: '2020-03-31T17:01:52.902Z',
      run_ended_at: '2020-03-31T17:02:00.296Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    '29': {
      id: 29,
      run_id: 29,
      run_created_at: '2020-03-31T17:02:51.357Z',
      run_ended_at: '2020-03-31T17:02:57.043Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    '30': {
      id: 30,
      run_id: 30,
      run_created_at: '2020-03-31T17:05:34.501Z',
      run_ended_at: '2020-03-31T17:05:39.136Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    },
    '31': {
      id: 31,
      run_id: 31,
      run_created_at: '2020-03-31T17:07:15.447Z',
      run_ended_at: '2020-03-31T17:07:20.321Z',
      consent_acknowledged_by_user: true,
      consent_granted_by_user: true,
      cohort_id: 1,
      scenario_id: 7,
      scenario_title: 'Multi Button Prompt',
      scenario_description: '',
      user_id: 2
    }
  },
  scenario: {
    author: {
      id: 2,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: {
      id: 57,
      prose:
        '<p>Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT\'s IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>'
    },
    description: 'A scenario about "Multiplayer Scenario"',
    finish: {
      id: 1,
      title: '',
      components: [
        {
          html: '<h2>Thanks for participating!</h2>',
          type: 'Text'
        }
      ],
      is_finish: true
    },
    lock: {
      scenario_id: 42,
      user_id: 2,
      created_at: '2020-01-01T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      {
        id: 2,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
            html:
              '<p><span style="font-size: 18px;"><strong>As the "Teacher" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>',
            type: 'Text'
          },
          {
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html:
              '<p><span style="font-size: 18px;"><strong>Welcome, here\'s a brief description of the problem we will solve together today!</strong></span></p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Multiplayer Scenario',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 42,
    created_at: '2020-02-31T17:50:28.029Z',
    updated_at: null,
    deleted_at: null
  },
  scenarios: [
    {
      id: 42,
      title: 'Multiplayer Scenario',
      description: 'A scenario about "Multiplayer Scenario"',
      created_at: '2020-02-31T17:50:28.029Z',
      updated_at: null,
      status: 1,
      deleted_at: null,
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          personalname: 'Super User',
          roles: ['super'],
          is_super: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      author: {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose:
          '<p>Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT\'s IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>'
      },
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 999,
        created_at: '2020-01-01T23:54:19.934Z',
        ended_at: null
      }
    }
  ],
  scenariosById: {
    '42': {
      id: 42,
      title: 'Multiplayer Scenario',
      description: 'A scenario about "Multiplayer Scenario"',
      created_at: '2020-02-31T17:50:28.029Z',
      updated_at: null,
      status: 1,
      deleted_at: null,
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          personalname: 'Super User',
          roles: ['super'],
          is_super: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      author: {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose:
          '<p>Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT\'s IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>'
      },
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 999,
        created_at: '2020-01-01T23:54:19.934Z',
        ended_at: null
      }
    }
  },
  tags: {
    categories: [],
    labels: [
      { key: 3, text: 'fun', value: 'fun' },
      { key: 5, text: 'Easy', value: 'Easy' }
    ],
    labelsInUse: ['Easy']
  },
  user: {
    username: null,
    personalname: null,
    email: null,
    id: null,
    roles: [],
    is_anonymous: false,
    is_super: true
  },
  users: [
    {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    {
      id: 4,
      username: 'credible-lyrebird',
      personalname: null,
      email: null,
      is_anonymous: true,
      roles: ['participant'],
      is_super: false
    },
    {
      id: 3,
      username: 'heartfull-cougar',
      personalname: 'Heartfull Cougar',
      email: 'heartfull-cougar@email.com',
      is_anonymous: false,
      roles: ['participant', 'facilitator'],
      is_super: false
    },
    {
      id: 5,
      username: 'perfect-oryx',
      personalname: 'Perfect Oryx',
      email: 'perfect-oryx@email.com',
      is_anonymous: false,
      roles: ['participant', 'facilitator'],
      is_super: false
    }
  ],
  usersById: {
    '999': {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    '3': {
      id: 3,
      username: 'heartfull-cougar',
      personalname: 'Heartfull Cougar',
      email: 'heartfull-cougar@email.com',
      is_anonymous: false,
      roles: ['participant', 'facilitator'],
      is_super: false
    },
    '4': {
      id: 4,
      username: 'credible-lyrebird',
      personalname: null,
      email: null,
      is_anonymous: true,
      roles: ['participant'],
      is_super: false
    },
    '5': {
      id: 5,
      username: 'perfect-oryx',
      personalname: 'Perfect Oryx',
      email: 'perfect-oryx@email.com',
      is_anonymous: false,
      roles: ['participant', 'facilitator'],
      is_super: false
    }
  }
};
