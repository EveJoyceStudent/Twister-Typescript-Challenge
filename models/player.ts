import { BodyParts } from "./bodyParts.enum";
import { Colours } from "./colours.enum";

export class Player {

  name: string;
  LeftHand: Colours;
  RightHand: Colours;
  LeftFoot: Colours;
  RightFoot: Colours;

  constructor(_name: string){
    this.name=_name;
  }  
}