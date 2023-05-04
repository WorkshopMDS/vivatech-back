export const speakers = {
  getSpeaker: {
    name: 'Success',
    httpStatusCode: 200,
    description: 'Success.',
    isOperational: true,
    data: {
      company: {
        name: 'Speaker Company',
        title: 'CE0',
      },
      firstname: 'Speaker',
      lastname: 'Example',
      biography: "I'm a speaker",
      picture: 'https://example.com/speaker.jpg',
      links: [],
    },
  },
  speakerReturn: {
    company: {
      name: 'Speaker Company',
      title: 'CE0',
    },
    firstname: 'Speaker',
    lastname: 'Example',
    biography: "I'm a speaker",
    picture: 'https://example.com/speaker.jpg',
    links: [],
  },
};
