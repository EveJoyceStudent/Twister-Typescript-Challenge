import { BodyParts } from "./bodyParts.enum";
import { Colours } from "./colours.enum";

export interface ISpin {
  colour: Colours;
  bodyPart: BodyParts;
}

// TO(DONE)DO: create a SpinRecord class which implements ISpin and adds a new attribute num:number
export class SpinRecord implements ISpin {

  num: Number;
  colour: Colours;
  bodyPart: BodyParts;

  constructor(_num: Number, _colour: Colours, _bodypart: BodyParts){
    this.num=_num;
    this.colour=_colour;
    this.bodyPart=_bodypart;
  }
  
}