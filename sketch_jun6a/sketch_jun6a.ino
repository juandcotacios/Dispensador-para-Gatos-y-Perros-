#include <Servo.h>

Servo myServo;

void setup() {
  Serial.begin(9600); // Iniciar comunicación serie a 9600 bps
  myServo.attach(9); // Conectar el servomotor al pin 9
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read(); // Leer el comando enviado desde el PC
    if (command == '1') {
      myServo.write(50); // Mover el servomotor a 50 grados
      delay(2700); // Mantener la posición por 2 segundos
      myServo.write(0); // Regresar el servomotor a 0 grados
      delay(1000);
      }
      }
}