const int outputPin = 13;

void setup() {
  pinMode(outputPin, OUTPUT);
  Serial.begin(9600); 

}

void loop() {
  if ( Serial.available() > 0 ) {
    int incomingByte = Serial.read();
    Serial.println(incomingByte);

    if ( incomingByte == 0x01 ) {
      digitalWrite( outputPin, HIGH );
    } 
    else if ( incomingByte == 0x00 ) {
      digitalWrite( outputPin, LOW );
    }
  }
}



