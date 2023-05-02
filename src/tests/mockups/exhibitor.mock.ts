export const exhibitor = {
  firstArrayKey: {
    "_id": "644e7dd0ddf96d366a6dd8c2",
    "name": "inwink",
    "picture": "https://storageprdv2inwink.blob.core.windows.net/abf9dc9e-3c12-4999-b77b-9e1614c9760d/d993fa2d-690b-45f9-bf9a-ae96209d5ce51",
    "place": "",
    "sectors": [
        "['Software Development', 'Cloud services']"
    ],
    "interests": [
        "['Saas']"
    ]
  },
  firstId: {
    "name": "Success",
    "httpStatusCode": 200,
    "description": "Success.",
    "isOperational": true,
    "data": {
        "_id": "644e7dd0ddf96d366a6dd8c2",
        "name": "inwink",
        "picture": "https://storageprdv2inwink.blob.core.windows.net/abf9dc9e-3c12-4999-b77b-9e1614c9760d/d993fa2d-690b-45f9-bf9a-ae96209d5ce51",
        "place": "",
        "sectors": [
            "['Software Development', 'Cloud services']"
        ],
        "interests": [
            "['Saas']"
        ]
    }
  },
  add: {
    "name": "TestAddExhibitor",
    "picture": "URL",
    "place": "999S",
    "sectors": ["Sector1", "Sector2"],
    "interests": ["Interest1", "Interest2"]
  },
  invalidAdd: {
    "name": "TestAddExhibitor",
    "picture": "URL",
    "sectors": ["Sector1", "Sector2"],
    "interests": ["Interest1", "Interest2"]
  },
  addResponse: {
    "name": "Success",
    "httpStatusCode": 201,
    "description": "Successfully created.",
    "isOperational": true,
    "data": {
        "name": "TestAddExhibitor",
        "picture": "URL",
        "place": "999S",
        "sectors": [
            "Sector1",
            "Sector2"
        ],
        "interests": [
            "Interest1",
            "Interest2"
        ],
        "__v": 0
    }
  },
  update: {
    "name": "TestUpdateExhibitor",
    "picture": "ThisShouldBeAnURL",
    "place": "123A",
    "sectors": ["Female", "Woman"],
    "interests": ["Food"]
  },
  invalidUpdate: {
    "name": "TestUpdateExhibitor",
    "picture": "ThisShouldBeAnURL",
    "sectors": ["Female", "Woman"],
    "interests": ["Food"]
  },
  updateResponse: {
    "name": "Success",
    "httpStatusCode": 200,
    "description": "Success.",
    "isOperational": true,
    "data": {
        "name": "TestUpdateExhibitor",
        "picture": "ThisShouldBeAnURL",
        "place": "123A",
        "sectors": [
            "Female",
            "Woman"
        ],
        "interests": [
            "Food"
        ]
    }
  },
  deleteResponse: {
    "name": "Success",
    "httpStatusCode": 200,
    "description": "Success.",
    "isOperational": true,
  },
  error400: {
    "name": "Error",
    "httpStatusCode": 400,
    "description": "Bad request.",
    "isOperational": true,
  },
  error404: {
    "name": "Error",
    "httpStatusCode": 404,
    "description": "Resource not found.",
    "isOperational": true,
  },
  error500: {
    "name": "Error",
    "httpStatusCode": 500,
    "description": "Internal server error.",
    "isOperational": true,
  },
};