/* 
This is a test sketch for the Adafruit assembled Motor Shield for Arduino v2
It won't work with v1.x motor shields! Only for the v2's with built in PWM
control

For use with the Adafruit Motor Shield v2 
---->	http://www.adafruit.com/products/1438
*/


#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_PWMServoDriver.h"

// Create the motor shield object with the default I2C address
Adafruit_MotorShield AFMS = Adafruit_MotorShield(); 
// Or, create it with a different I2C address (say for stacking)
// Adafruit_MotorShield AFMS = Adafruit_MotorShield(0x61); 

// Connect a stepper motor with 200 steps per revolution (1.8 degree)
// to motor port #2 (M3 and M4)
Adafruit_StepperMotor *myMotor = AFMS.getStepper(200, 2);
Adafruit_StepperMotor *myMotor2 = AFMS.getStepper(200, 1);

const int stepAmount = 10;

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps
  Serial.println("Stepper test!");

  AFMS.begin();  // create with the default frequency 1.6KHz
  //AFMS.begin(1000);  // OR with a different frequency, say 1KHz
  
  myMotor->setSpeed(10);  // 10 rpm
  myMotor2->setSpeed(10);  // 10 rpm  
}

void loop() {
 if ( Serial.available() > 0 ) {
    int incomingByte = Serial.read();
    Serial.println(incomingByte);

    if ( incomingByte == 0x01 ) {
      //digitalWrite( outputPin, HIGH );
      myMotor->step(stepAmount, FORWARD, SINGLE); 
    } 
    else if ( incomingByte == 0x00 ) {
      myMotor->step(stepAmount, BACKWARD, SINGLE); 
    }
    else if ( incomingByte == 0x10 ) {
      myMotor2->step(stepAmount, FORWARD, SINGLE); 
    }
    else if ( incomingByte == 0x11 ) {
      myMotor2->step(stepAmount, BACKWARD, SINGLE); 
    }
  }  
}
