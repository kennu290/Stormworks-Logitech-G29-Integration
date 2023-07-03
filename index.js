const express = require('express');
const axios = require('axios');
const g29 = require('logitech-g29');
const readlineSync = require('readline-sync');

const app = express();
const port = 3000;

// Version information
const currentVersion = '0.0.2'; 
console.clear();

function continuePrompt(){
  // Prompt for user input synchronously
  const input = readlineSync.question('Do you want to continue anyway? (y/n)').toLowerCase();

  // Handle the user input
  if (input === 'y') {
    console.clear()
    return
  } else if (input === 'n') {
    //Close the program
    process.exit();
  } else {
    console.log('Invalid input. Please enter either "y" or "n".');
    continuePrompt()
  }
}

// Function to check for updates
function checkForUpdates() {
  return new Promise((resolve, reject) => {
    axios.get('https://raw.githubusercontent.com/kennu290/Stormworks-Logitech-G29-Integration/main/version.txt')
      .then(response => {
        const latestVersion = response.data;
        if (latestVersion !== currentVersion) {
          console.log('An update is available. Please update your application to the latest version:', latestVersion);
          console.log('You can download the update at: https://github.com/kennu290/Stormworks-Logitech-G29-Integration/tree/main');
          console.log(" ")
          continuePrompt()

        } else {
          console.log('\x1b[32m%s\x1b[0m', 'Your application is up to date.');
        }
        resolve();
      })
      .catch(error => {
        //Resolving so you can use it offline.
        resolve(error);
      });
  });
}

async function performStartupAnimation() {
  const ledSequences = [
    "10000",
    "11000",
    "11100",
    "11110",
    "11111"
  ];

  const delay = 100;

  for (const sequence of ledSequences) {
    g29.leds(sequence);
    await sleep(delay);
  }

  // Turn off all the LEDs
  g29.leds("00000");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function main(){
  let steering = 0;
  let throttle = 0;
  let clutch = 0;
  let brake = 0;
  let gear = 0;

  let shift_left = false;
  let shift_right = false;

  let xButton = false;
  let circleButton = false;
  let triangleButton = false;
  let squareButton = false;

  let l2Button = false;
  let r2Button = false;

  let l3Button = false;
  let r3Button = false;

  let minusButton = false;
  let plusButton = false;

  let wheelSpinner = 0;
  let spinnerButton = false;

  let shareButton = false
  let optionsButton = false
  let playstationButton = false


  const options = {
    autocenter: false,
  }

  // Read data from the Logitech G29
  g29.connect(options, function(err) {  
    console.log('\x1b[32m%s\x1b[0m', '■', 'Connection To Steering Wheel Successful!');
    performStartupAnimation()
    
      //Subscribe to the events.
      g29.on('shifter-gear', val => {
          gear = val
      });

      g29.on('wheel-turn', val => {
          val = (val / 50) - 1;
          steering = val;
      });

      g29.on('pedals-gas', val => {
          throttle = val;
      });

      g29.on('pedals-clutch', val => {
          clutch = val;
      });

      g29.on('pedals-brake', val => {
          brake = val;
      });

      //Back shifter thingies
      g29.on('wheel-shift_left', val => {
        if (val === 1){
          shift_left = true
        }else{
          shift_left = false
        }
      });
      
      g29.on('wheel-shift_right', val => {
        if (val === 1){
          shift_right = true
        }else{
          shift_right = false
        }
      });

      //Playstation shape buttons
      g29.on('wheel-button_x', val => {
        if (val === 1){
          xButton = true
        }else{
          xButton = false
        }
      });

      g29.on('wheel-button_square', val => {
        if (val === 1){
          squareButton = true
        }else{
          squareButton = false
        }
      });

      g29.on('wheel-button_triangle', val => {
        if (val === 1){
          triangleButton = true
        }else{
          triangleButton = false
        }
      });

      g29.on('wheel-button_circle', val => {
        if (val === 1){
          circleButton = true
        }else{
          circleButton = false
        }
      });

      //Trigger buttons

      g29.on('wheel-button_l2', val => {
        if (val === 1){
          l2Button = true
        }else{
          l2Button = false
        }
      });

      g29.on('wheel-button_r2', val => {
        if (val === 1){
          r2Button = true
        }else{
          r2Button = false
        }
      });
      
      //Stick click

      g29.on('wheel-button_l3', val => {
        if (val === 1){
          l3Button = true
        }else{
          l3Button = false
        }
      });

      g29.on('wheel-button_r3', val => {
        if (val === 1){
          r3Button = true
        }else{
          r3Button = false
        }
      });

      //Minus and plus buttons

      g29.on('wheel-button_minus', val => {
        if (val === 1){
          minusButton = true
        }else{
          minusButton = false
        }
      });

      g29.on('wheel-button_plus', val => {
        if (val === 1){
          plusButton = true
        }else{
          plusButton = false
        }
      });

      //Spinner
      
      g29.on('wheel-spinner', val => {
          wheelSpinner = val
      });
      
      g29.on('wheel-button_spinner', val => {
        if (val === 1){
          spinnerButton = true
        }else{
          spinnerButton = false
        }
      });

      //Other buttons

      g29.on('wheel-button_share', val => {
        if (val === 1){
          shareButton = true
        }else{
          shareButton = false
        }
      });

      g29.on('wheel-button_option', val => {
        if (val === 1){
          optionsButton = true
        }else{
          optionsButton = false
        }
      });

      g29.on('wheel-button_playstation', val => {
        if (val === 1){
          playstationButton = true
        }else{
          playstationButton = false
        }
      });


    // Set up route to serve the data
    app.get('/data', (req, res) => {
        const forceFeedback = parseFloat(req.query.forceFeedback) || 0; // Default value is 0 if not provided
        const LEDs = req.query.LEDs || ""; // Default value is an empty string if not provided

        // Convert the forceFeedback value from range 0 to 1 to the desired range -1 to 1
        const convertedForceFeedback = (forceFeedback + 1) / 2;

        // Apply the force feedback
        g29.forceConstant(convertedForceFeedback);

        if (LEDs === 0.0){
          g29.leds("")
        }else{
          g29.leds(LEDs)
        }

        const data = {
            steering,
            throttle,
            clutch,
            brake,
            gear,
            shift_left,
            shift_right,
            xButton,
            circleButton,
            triangleButton,
            squareButton,
            l2Button,
            r2Button,
            l3Button,
            r3Button,
            minusButton,
            plusButton,
            wheelSpinner,
            spinnerButton,
            shareButton,
            optionsButton,
            playstationButton,
        };
        res.json(data);
    });

    app.listen(port, () => {
        console.log('\x1b[32m%s\x1b[0m', '■', `Server is running on http://localhost:${port}/data`);
    });
  });
}

// Check for updates on program startup
checkForUpdates()
  .then(() => {
    // Start the server
    main()
  })
  .catch(error => {
    // Handle the error
    console.log('\x1b[41m%s\x1b[0m', 'An error occurred while checking for updates:', error.message);
  });


