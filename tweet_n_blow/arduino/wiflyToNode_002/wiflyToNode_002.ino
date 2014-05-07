#include <SPI.h>
#include <WiFly.h>

//

char* ssid = "AP0N"; //enter your SSID here, replace all spaces with $ (ex. "my ssid lol" = "my$ssid$lol")
char* pass = ""; //enter your wifi passphrase here

char* serverAddress = "192.168.1.110"; //enter the IP of your node.js server
int serverPort = 8000; //enter the port your node.js server is running on, by default it is 1337

WiFlyClient client;

void setup() {
  Serial.begin(9600);
  WiFly.setUart(&Serial);
  WiFly.begin();
  WiFly.join(ssid, pass, true);
  client.connect(serverAddress,serverPort);
}

void loop() {
  
  long start = millis();  
//  Serial.print("B");
//  Serial.print(total1 - total2);
  Serial.print("E");
  Serial.println();

  delay(100);
}
