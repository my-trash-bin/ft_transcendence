import { InvalidIdException } from "../application/exception/InvalidIdException";

export const filterInvalidIdException = <View>(results: (View | InvalidIdException)[]) => 
  results.filter(result => !(result instanceof InvalidIdException)) as View[];