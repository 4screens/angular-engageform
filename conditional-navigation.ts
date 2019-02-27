import Quiz from './src/api/quiz.interface'
import Engageform from './src/engageform/engageform'
import { Navigation } from './src/navigation'
import Case from './src/page/case'

export default class ConditionalNavigation extends Navigation {
  static fromEnageformAndData(engageform: Engageform, data: Quiz): Navigation {
    return new ConditionalNavigation(engageform, data)
  }

  constructor(engageform: Engageform, data: Quiz) {
    super(engageform)
    const logic = JSON.parse((data as any)._logic) || []
    console.log('LOGIC', logic)
  }

  protected move(vcase?: Case) {
    return super.move(vcase, this.getStepSizeForCase(vcase))
  }

  private getStepSizeForCase(vcase?: Case): number | undefined {
    if (!vcase) {
      return undefined
    } else {
      return undefined
    }
  }
}
