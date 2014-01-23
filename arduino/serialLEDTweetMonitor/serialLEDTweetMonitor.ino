#include "LPD8806.h" //Adafruit Adressable LED library (mode: LPD8806) for Arduino
#include "SPI.h"

// Twitter Love/Hate LED Strip Monitor - light pixels according to USB serial input

/*****************************************************************************/


// Number of RGB LEDs in strand:
int nLEDs = 48;




// Below you can optionally use hardware SPI for faster writes, just leave out
// the data and clock pin parameters.  But this does limit use to very
// specific pins on the Arduino.  For "classic" Arduinos (Uno, Duemilanove,
// etc.), data = pin 11, clock = pin 13.  For Arduino Mega, data = pin 51,
// clock = pin 52.  For 32u4 Breakout Board+ and Teensy, data = pin B2,
// clock = pin B1.  For Leonardo, this can ONLY be done on the ICSP pins.



//"love" output pins -- using hardware SPI defaults
//clockpin 13
//datapin 11   plus ground

//"hate" output pins
int clockPin = 3;
int dataPin  = 2;

// initialize strip using LPD8806 Library constructor
// Insert additional parameters of SPI data and clock pins if not using harware spi:
LPD8806 loveStrip = LPD8806(nLEDs);
LPD8806 hateStrip = LPD8806(nLEDs, dataPin, clockPin);






char tweetCode;
int tweetRate;
int tweetPixel;

int oldLovePixel = 0;
int oldHatePixel = 0;


void setup() {
  // initialize serial:
  Serial.begin(9600);
  
   // Start up the LED strip
  loveStrip.begin(); 
  hateStrip.begin(); 
  // Update the strip, to start they are all 'off'
   loveStrip.show();
   hateStrip.show();
 
}

void loop() {
     
}

//serialEvent is triggered every time Serial data is received
void serialEvent() { 
  
  while (Serial.available()) {
    // get the new byte:
    
     tweetCode = Serial.read(); //char at start that indicates "love" or "hate" tweet
     tweetRate = (int) Serial.parseInt();
     tweetPixel = map(tweetRate, 0, 100, 0, 48); //maps the tweets-per-second onto 48 pixels of strand
     
      //Serial.println(tweetCode); //check with node/terminal to see if arduino received the bytes you intended
      //Serial.println(tweetRate);
     
     
   
     
		switch(tweetCode){
			case 108 : // "l":love
				
                                wipeToPixel(loveStrip, loveStrip.Color(  127,   0, 127), 50, tweetPixel, oldLovePixel);
                                oldLovePixel = tweetPixel;
                                delay(50);
			break;
			case 104 :  //"h":hate
				 wipeToPixel(hateStrip, hateStrip.Color(  0,   0, 127), 50, tweetPixel, oldHatePixel);
                                 oldHatePixel = tweetPixel;
                                 delay(50);
			break;
			
		}
            

  }
}



//depending on where your oldvalue is, it will move to that new value
void wipeToPixel(LPD8806 strip, uint32_t c, uint8_t wait, uint8_t newPixel, uint8_t oldPixel) {
  int i;
          
          if ( newPixel > oldPixel){
            
              for (i=oldPixel; i< newPixel ; i++) {
                  strip.setPixelColor(i, c);
                  strip.show();
                  delay(wait);
              }
            
            
          }else {
            
              for (i=oldPixel; i> newPixel ; i--) {
                  strip.setPixelColor(i, 0);
                  strip.show();
                  delay(wait);
              }
            
          }

}


