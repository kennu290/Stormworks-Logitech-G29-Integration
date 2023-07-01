# Introduction

Idk what to put here lmao. Anyway, this is the documentation for the microcontroller part of the Logitech G29 integration with Stormworks with force feedback and the other stuff.

# Ingame Setup

Ingame, I suggest you completely unbind all controller binds, as they may conflict with the microcontroller. (EG. You press X but Stormworks thinks you pressed drop item so both actions trigger) This may not be an issue in all cases, but just to be sure, I recommend it. Other than that, you can just put the microcontroller.

# Composite button Mapping

Here is the composite mapping for the "Buttons" node with the number corresponding to the channel the specific button is on:

1. Shifter left
2. Shifter right
3. X
4. Circle
5. Triangle
6. Square
7. L2
8. R2
9. L3
10. R3
11. Minus button
12. Plus button
13. Spinner button
14. Share
15. Options
16. Playstation

The wheel spinner outputs a value ranging from 1 to -1. Instead of treating it as a button input, I have decided to directly transfer this value to Stormworks. You can access it through the "Buttons" node on channel 1 as a number input. This is so you could build your own logic on top of this.

The D-Pad is currently not available due to me being lazy af, but will be in the future.

# LED Control

The LEDs can be controlled using a numerical sequence consisting of zero to five characters, where each character is either 0 (indicating off) or 1 (indicating on). The position of the number within the sequence determines the specific LED that you want to control. For example, if you want to activate both red LEDs, you would use the sequence 00001. Similarly, to activate both sets of yellow LEDs, you would use the sequence 00110.

I have discovered a straightforward table that effectively controls the LEDs. Although there are additional potential configurations, this table serves as a reliable starting point:

| LED Sequence | LED Configuration    |
|--------------|----------------------|
| 00000        | All off              |
| 11100        | Green, Green, Orange |
| 10000        | Green                |
| 00001        | Red only             |

# Force feedback

The force feedback node accepts a number between 1 and -1. This determines the strength and direction of force applied to the steering wheel. For example, inserting 1 will turn the steering wheel right at full force. You can use this with an angular speed sensor that is multiplied to emulate wheel movement, thus creating a (somewhat) realistic force on the steering wheel. Or you could take this a step further and create a custom microcontroller that has rumble effects and whatever else you may want. The possibilities are endless.
