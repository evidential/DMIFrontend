const config =  {
  version: '1.1.2',
  socketServerURL: '//evidentialrealityserver.com',
  s3Bucket: 'https://dmi-frontend.s3.eu-west-2.amazonaws.com/',
  envirinmentModel: 'House.glb',
  environments: [
    {
      id: 0,
      name: 'Outside Back',
      cameraPosition: {
        x: 7.5,
        y: 1.5,
        z: 4.7
      },
      cameraRotation: {
        x: 6,
        y: 36,
        z: 0
      },
      model: '',
      image: 'environment6.jpg',
      interactableItems: [48]
    },
    {
      id: 1,
      name: 'Kitchen/Diner',
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
      interactableItems: [0,1,2,3,6,8,11,13,23,22,24,25,26,27,28,31,32,33,34,35,36,43,46,47,49,53,54,56,58,59,60,61,62,63,64,65,72,73,74]
    },
    {
      id: 2,
      name: 'Back Room',
      cameraPosition: {
        x: 3.635,
        y: 1.5,
        z: 0.984
      },
      cameraRotation: {
        x: -19,
        y: 212,
        z: 0
      },
      model: '',
      image: 'environment3.jpg',
      interactableItems: [4,5,7,9,14,15,16,17,18,19,21,39,40,41,42,45,50,51,57,66,69,70,71]
    },
    {
      id: 3,
      name: 'Cot Room',
      cameraPosition: {
        x: -0.832,
        y: 4.34,
        z: 4.101
      },
      cameraRotation: {
        x: -10,
        y: 54,
        z: 0
      },
      model: '',
      image: 'environment4.jpg',
      interactableItems: [12,29]
    },
    {
      id: 4,
      name: 'Bathroom',
      cameraPosition: {
        x: -3.427,
        y: 4.34,
        z: 0.136
      },
      cameraRotation: {
        x: -19,
        y: -3.6,
        z: 0
      },
      model: '',
      image: 'environment5.jpg',
      interactableItems: [44]
    },
    {
      id: 5,
      name: 'Outside',
      cameraPosition: {
        x: -1.5,
        y: 1.5,
        z: -4.3
      },
      cameraRotation: {
        x: 9,
        y: 320,
        z: 0
      },
      model: 'House.glb',
      image: 'environment1.jpg',
      interactableItems: [20,30,37,38,52,55, 68]
    }
  ],
  interactableItems: [
    {
      ItemNumber: 0,
      glbID: 'Amazon_Echo_Show_10',
      name: 'Amazon Echo Show',
      info: 'Amazon Echo Show 10.',
      image: 'item0.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 1,
      glbID: 'Amazon_Ordering_Device_Holder',
      name: 'Device Holder',
      info: 'Amazon Ordering Device Holder',
      image: 'item1.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 2,
      glbID: 'Apple_Air_Tag_Box',
      name: 'Air Tracker',
      info: 'Apple Air Tag Box.',
      image: 'item2.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 3,
      glbID: 'Macbook_Laptop',
      name: 'Macbook',
      info: 'Apple Macbook Laptop.',
      image: 'item3.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 4,
      glbID: 'Apple_Watch_01a_Open_Strap',
      name: 'Black Watch',
      info: 'Black Apple Watch.',
      image: 'item4.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 5,
      glbID: 'Apple_Watch_01a_Closed_Strap',
      name: 'Grey Watch',
      info: 'Grey Apple Watch.',
      image: 'item5.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 6,
      glbID: 'PF_USB_Bag_01a',
      name: 'USB Sticks',
      info: 'Bag_of USB Sticks.',
      image: 'item6.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 7,
      glbID: 'PowerBank',
      name: 'Power Bank',
      info: 'Black Power Bank.',
      image: 'item7.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 8,
      glbID: 'SM_Book_C',
      name: 'Book By Robert Louis Stevenson',
      info: 'Dr Jekyll & Mr Hyde.',
      image: 'item8.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -0.6,
        up: -0.3
      }
    },
    {
      ItemNumber: 9,
      glbID: 'BT_Router_Hub_6',
      name: 'BT Router',
      info: 'Type A BT Router Hub 6.',
      image: 'item9.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    /*{
      ItemNumber: 10,
      glbID: 'Burglar_Alarm_A',
      name: 'Burglar Alarms',
      info: 'Burglar Alarms.',
      image: 'item10.png',
      seized: false,
      cameraOverrides: {
        depth: -0.5,
        up: 0.2
      }
    },*/
    {
      ItemNumber: 11,
      glbID: 'Computer_System',
      name: 'Computer System',
      info: 'Computer System.',
      image: 'item11.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -0.6,
        up: -0.2
      }
    },
    {
      ItemNumber: 12,
      glbID: 'D_Link_Wifi_Camera',
      name: 'Wifi Camera',
      info: 'D Link Wifi Camera.',
      image: 'item12.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 13,
      glbID: 'D_Link_Wifi_Router',
      name: 'D Link Router',
      info: 'D Link Wifi Router',
      image: 'item13.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 14,
      glbID: 'DJI_Mavic_Pro_Controller_Unfolded',
      name: 'Drone Controller',
      info: 'DJI Mavic Pro Drone Controller',
      image: 'item14.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 15,
      glbID: 'DJI_Mavic_Pro_Assembled_Folded',
      name: 'Drone',
      info: 'DJI Mavic Pro Drone',
      image: 'item15.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 16,
      glbID: 'DJI_Mini_Pro_3_Controller',
      name: 'Mini Drone Controller',
      info: 'DJI Mini Pro_3 Drone Controller.',
      image: 'item16.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 17,
      glbID: 'DJI_Mini_Pro_3_Unfolded',
      name: 'Mini Drone',
      info: 'DJI Mini Pro 3 Drone.',
      image: 'item17.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 18,
      glbID: 'DJI_Phantom_2_Controller',
      name: 'Phantom Drone Controller',
      info: 'DJI Phantom 2 Drone Controller.',
      image: 'item18.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 19,
      glbID: 'DJI_Phantom_2',
      name: 'Phantom Drone',
      info: 'DJI_Phantom_2_Drone.',
      image: 'item19.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 20,
      glbID: 'Dremel_Multi_Tool',
      name: 'Multi Tool',
      info: 'Dremel Multi Tool.',
      image: 'item20.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 21,
      glbID: 'SmartDevice_Home_B',
      name: 'Echo Dot',
      info: 'Echo Dot Device.',
      image: 'item21.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 22,
      glbID: 'EE_Mi_Fi_Box',
      name: 'EE MiFi Box',
      info: 'Yellow EE Mobile WiFi Hotspot Device.',
      image: 'item22.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 23,
      glbID: 'External_Hard_Drive_01a',
      name: 'External HardDrive',
      info: 'External HardDrive',
      image: 'item23.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 24,
      glbID: 'Giles_Kit',
      name: 'Giles Kit',
      info: 'Giles Kit',
      image: 'item24.png',
      seized: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 25,
      glbID: 'Internal_Hard_Drive_001',
      name: 'Internal HardDrive 1',
      info: 'Internal HardDrive 1',
      image: 'item25.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 26,
      glbID: 'Internal_Hard_Drive_002',
      name: 'Internal HardDrive 2',
      info: 'Internal HardDrive 2',
      image: 'item25.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 27,
      glbID: 'Internal_Hard_Drive_003',
      name: 'Internal HardDrive 3',
      info: 'Internal HardDrive 3',
      image: 'item25.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 28,
      glbID: 'Apple_iPhone_14_Pro',
      name: 'Iphone',
      info: 'Iphone 14 Pro',
      image: 'item28.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 29,
      glbID: 'Kindle_Tablet',
      name: 'Amazon Kindle',
      info: 'Amazon Kindle Tablet',
      image: 'item29.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 30,
      glbID: 'PF_Land_Rover_Discovery_Sport_01a001',
      name: 'Land Rover',
      info: 'Land Rover Discovery Sport',
      image: 'item30.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -3,
        up: -0.5
      }
    },
    {
      ItemNumber: 31,
      glbID: 'Laptop_A_Open_001',
      name: 'Laptop 1',
      info: 'Laptop 1',
      image: 'item31.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 32,
      glbID: 'Laptop_A_Open_002',
      name: 'Laptop 2',
      info: 'Laptop 2',
      image: 'item31.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 33,
      glbID: 'Laptop_A_Open_003',
      name: 'Laptop 3',
      info: 'Laptop 3',
      image: 'item31.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 34,
      glbID: 'Laptop_A_Open_004',
      name: 'Laptop 4',
      info: 'Laptop 4',
      image: 'item31.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 35,
      glbID: 'Laptop_A_Open_005',
      name: 'Laptop 5',
      info: 'Laptop 5',
      image: 'item31.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 36,
      glbID: 'LG_Smart_Fridge',
      name: 'Smart Fridge',
      info: 'LG Smart Fridge',
      image: 'item36.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -1,
        up: -1.5
      }
    },
    {
      ItemNumber: 37,
      glbID: 'Licence_Plate_Front',
      name: 'Licence Plate Front',
      info: 'Licence Plate Front',
      image: 'item37.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 38,
      glbID: 'Licence_Plate_Rear',
      name: 'Licence Plate Rear',
      info: 'Licence Plate Rear',
      image: 'item38.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 39,
      glbID: 'Pelican_Case_A',
      name: 'Drone Case',
      info: 'Mavic Pro Drone Case',
      image: 'item39.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 40,
      glbID: 'Nintendo_Switch',
      name: 'Nintendo Switch',
      info: 'Nintendo Switch Game Console',
      image: 'item40.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 41,
      glbID: 'Nokia_101',
      name: 'Nokia 101',
      info: 'Nokia 101 Phone',
      image: 'item41.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 42,
      glbID: 'Nokia_6300',
      name: 'Nokia Phone 6300',
      info: 'Nokia Phone 6300',
      image: 'item42.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 43,
      glbID: 'DMI_Notepad',
      name: 'Notepad',
      info: 'Notepad Digits',
      image: 'item43.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 44,
      glbID: 'Sticky_Note_B',
      name: 'Post It Note',
      info: 'Post It Note',
      image: 'item44.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -0.1,
        up: -0.1
      }
    },
    {
      ItemNumber: 45,
      glbID: 'Playstation4Pro',
      name: 'PS4 Pro',
      info: 'PlayStation 4 Pro Games Console',
      image: 'item45.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 46,
      glbID: 'Rasberry_Pi_Case',
      name: 'Cased Rasberry Pie',
      info: 'Cased Rasberry Pie',
      image: 'item46.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 47,
      glbID: 'Rasberry_Pi_01a_3',
      name: 'Rasberry Pie',
      info: 'Rasberry Pie',
      image: 'item47.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 48,
      glbID: 'Ring_Doorbell',
      name: 'Ring Doorbell',
      info: 'Ring Doorbell',
      image: 'item48.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 49,
      glbID: 'Router_Box',
      name: 'Router Box',
      info: 'Router Box',
      image: 'item49.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 50,
      glbID: 'Samsung_Galaxy_Z_Flip_4',
      name: 'Samsung Phone',
      info: 'Samsung Galaxy Z Flip 4',
      image: 'item50.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 51,
      glbID: 'Samsung_Smart_Watch',
      name: 'Samsung Watch',
      info: 'Samsung Gear S3 Watch',
      image: 'item51.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 52,
      glbID: 'Smart_Camera_001',
      name: 'Smart Cameras',
      info: 'Smart Cameras',
      image: 'item52.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 53,
      glbID: 'Smart_Tag',
      name: 'Smart Tag',
      info: 'Smart Tag',
      image: 'item53.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 54,
      glbID: 'Tesla_Access_Card',
      name: 'Tesla Access Card',
      info: 'Tesla Access Card',
      image: 'item54.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 55,
      glbID: 'Electric_Car',
      name: 'Tesla',
      info: 'Tesla Car',
      image: 'item55.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -3,
        up: -0.3
      }
    },
    {
      ItemNumber: 56,
      glbID: 'TK_Star_GPS_Tracker',
      name: 'TK Star Tracker',
      info: 'TK Star GPS Tracker Tracker Box.',
      image: 'item56.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 57,
      glbID: 'Trezor_Crypto_Wallet',
      name: 'Crypto Wallet',
      info: 'Trezor Crypto Wallet',
      image: 'item57.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 58,
      glbID: 'USB_Flash_Drive_001',
      name: 'USB_Stick 1',
      info: 'USB_Stick 1',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 59,
      glbID: 'USB_Flash_Drive_002',
      name: 'USB_Stick 2',
      info: 'USB_Stick 2',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 60,
      glbID: 'USB_Flash_Drive_003',
      name: 'USB_Stick 3',
      info: 'USB_Stick 3',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 61,
      glbID: 'USB_Flash_Drive_004',
      name: 'USB_Stick 4',
      info: 'USB_Stick 4',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 62,
      glbID: 'USB_Flash_Drive_005',
      name: 'USB_Stick 5',
      info: 'USB_Stick 5',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 63,
      glbID: 'USB_Flash_Drive_006',
      name: 'USB_Stick 6',
      info: 'USB_Stick 6',
      image: 'item58.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 64,
      glbID: 'Cloud_Storage_Devices_01a',
      name: 'Cloud Device',
      info: 'WD Personal Cloud Device',
      image: 'item63.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 65,
      glbID: 'Vodafone_Mi_Fi_Box',
      name: 'Vodafone Mifi Box',
      info: 'White Vodafone Mifi Box',
      image: 'item64.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 66,
      glbID: 'Samsung_Wireless_Charger',
      name: 'Watch Charger',
      info: 'Wireless Watch Charger',
      image: 'item65.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 67,
      glbID: 'XboxSeriesS',
      name: 'Xbox Games Console',
      info: 'Xbox Series S Games Console',
      image: 'item66.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 68,
      glbID: 'Outdoor_Security_Light',
      name: 'Outdoor Security Light',
      info: 'Outdoor Security Light',
      image: 'item67.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -0.9,
        up: 0
      }
    },
    {
      ItemNumber: 69,
      glbID: 'Headphones_01a_LOD1',
      name: 'Headphones',
      info: 'Music Headphones',
      image: 'item68.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: {
        depth: -0.4,
        up: 0
      }
    },
    {
      ItemNumber: 70,
      glbID: 'Fingbox_01a',
      name: 'Fingbox',
      info: 'Fingbox Network Device',
      image: 'item69.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 71,
      glbID: 'Fingbox_Network_Box_01a',
      name: 'Fingbox Box',
      info: 'Fingbox Packaging Box',
      image: 'item70.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 72,
      glbID: 'Rasberry_Pi_2',
      name: 'Rasberry Pi With Screen',
      info: 'Rasberry Pi With Screen',
      image: 'item71.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 73,
      glbID: 'Plug_A',
      name: 'USB C Plug',
      info: 'USB C Plug',
      image: 'item72.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    },
    {
      ItemNumber: 74,
      glbID: '__20_Note',
      name: '£20 note',
      info: 'Twenty pound note',
      image: 'item73.png',
      IsSeized: false,
      IsTriaged: false,
      IsIgnored: false,
      cameraOverrides: null
    }
  ]
};

export { config };
