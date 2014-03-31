const int pin = A0;
const int led = 9;

int value;

void setup() {
  Serial.begin(9600);
 }

void loop() {
  int num = analogRead(pin);
  value = map(num, 0, 1024, 0, 255);
  Serial.write(value);
  
  analogWrite(led, value);         
  delay(30);
}
