export const exhibitor = {
  firstArrayKey: {
    name: 'TestAddExhibitor',
    picture: 'URL',
    place: '999S',
    sectors: ['Sector1', 'Sector2'],
    interests: [] as object[],
  },
  firstId: {
    name: 'Success',
    httpStatusCode: 200,
    description: 'Success.',
    isOperational: true,
    data: {
      name: 'TestAddExhibitor',
      picture: 'URL',
      place: '999S',
      sectors: ['Sector1', 'Sector2'],
      interests: [] as object[],
    },
  },
  add: {
    name: 'TestAddExhibitor',
    picture: 'URL',
    place: '999S',
    sectors: ['Sector1', 'Sector2'],
    interests: [],
  },
  invalidAdd: {
    name: 'TestAddExhibitor',
    picture: 'URL',
    sectors: ['Sector1', 'Sector2'],
    interests: [],
  },
  addResponse: {
    name: 'Success',
    httpStatusCode: 201,
    description: 'Successfully created.',
    isOperational: true,
    data: {
      name: 'TestAddExhibitor',
      picture: 'URL',
      place: '999S',
      sectors: ['Sector1', 'Sector2'],
      interests: [] as object[],
    },
  },
  update: {
    name: 'TestUpdateExhibitor',
    picture: 'ThisShouldBeAnURL',
    place: '123A',
    sectors: ['Female', 'Woman'],
    interests: [],
  },
  invalidUpdate: {
    name: 'TestUpdateExhibitor',
    picture: 'ThisShouldBeAnURL',
    sectors: ['Female', 'Woman'],
    interests: [],
  },
  updateResponse: {
    name: 'Success',
    httpStatusCode: 200,
    description: 'Success.',
    isOperational: true,
    data: {
      name: 'TestUpdateExhibitor',
      picture: 'ThisShouldBeAnURL',
      place: '123A',
      sectors: ['Female', 'Woman'],
      interests: [] as object[],
    },
  },
  deleteResponse: {
    name: 'Success',
    httpStatusCode: 200,
    description: 'Success.',
    isOperational: true,
  },
};
