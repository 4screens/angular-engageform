import Engageform from '../../engageform/engageform'
import Page from '../page'
import { PageType } from '../page-type.enum'
import QuizQuestion from '../../api/quiz-question.interface'
import Case from "../case";
import {ProjectCase} from "../case/project";

interface ProjectQuestion {
  _id: string;
}

export default class Project extends Page {
  readonly type = PageType.Project

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    if (!data.answers) {
      return
    }

    this.cases = data.answers.map((answer) => {
      return this.createCase(answer)
    })

    var project: ProjectQuestion|null = data.answers.length ? data.answers[0] as ProjectQuestion : null;
    this.projectId = project ? project._id : null;
  }

  createCase(answer: any): Case {
    return new ProjectCase(this, answer)
  }
}
