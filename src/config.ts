const config =  {
  version: '1.0.0',
  environments: [
    {
      id: 0,
      name: 'Outside',
      cameraPosition: {
        x: 2.849,
        y: 1.5,
        z: -7.723
      },
      cameraRotation: {
        x: 9,
        y: 157,
        z: 0
      },
      model: 'DMI_House.glb',
      image: 'environment1.jpg',
      seizableItems: []
    },
    {
      id: 1,
      name: 'Lounge',
      cameraPosition: {
        x: -1.6,
        y: 1.5,
        z: 0
      },
      cameraRotation: {
        x: -5,
        y: 244,
        z: 0
      },
      model: '',
      image: 'environment2.jpg',
      seizableItems: [0,1,2]
    },
    {
      id: 2,
      name: 'Riser Room 3',
      cameraPosition: {
        x: 2.849,
        y: 1.5,
        z: 5.664
      },
      cameraRotation: {
        x: 2,
        y: 220,
        z: 0
      },
      model: '',
      image: 'environment3.jpg',
      seizableItems: []
    },
    {
      id: 3,
      name: 'Ward Room',
      cameraPosition: {
        x: 8.315,
        y: 2.757,
        z: 3.119
      },
      cameraRotation: {
        x: -8,
        y: 210,
        z: 0
      },
      model: '',
      image: 'environment4.jpg',
      seizableItems: []
    },
    {
      id: 4,
      name: 'Fire Door',
      cameraPosition: {
        x: 0.459,
        y: 1.5,
        z: 7.451
      },
      cameraRotation: {
        x: 8,
        y: -182,
        z: 0
      },
      model: '',
      image: 'environment5.jpg',
      seizableItems: []
    }
  ],
  seizableItems: [
    {
      id: 0,
      name: 'Air Tracker',
      info: 'Apple Air Tracker Box.',
      image: 'item0.png',
      model: 'Apple_Air_Tracker_Box_01a.glb',
      seized: false
    },
    {
      id: 1,
      name: 'EE MiFi Box',
      info: 'EE Mobile WiFi Hotspot Device.',
      image: 'item1.png',
      model: 'EE_Mi_Fi_Box_01a.glb',
      seized: false
    },
    {
      id: 2,
      name: 'TK Star Tracker',
      info: 'TK Star GPS Tracker Tracker Box.',
      image: 'item2.png',
      model: 'TK_Star_Gps_Tracker_01a.glb',
      seized: false
    }
  ]
};

export { config };
