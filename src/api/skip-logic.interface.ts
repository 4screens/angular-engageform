export interface QuestionLogic<ConditionType extends BaseCondition> {
  // Object's ID.
  _id: string

  // ID of the question this logic object belongs to.
  questionId: string

  // List of all rules managing to this condition object.
  rules: Array<DefaultRule | EntryRule<ConditionType> | ExitRule<ConditionType>>
}

interface BaseRule {
  // ID of the question the rule will forward to.
  destination: string
}

// "Otherwise" rule executed when no other rule matches.
interface DefaultRule extends BaseRule {
  type: 'default'
}

interface ConditionalRule<ConditionTypes> extends BaseRule {
  // How conditions are connected with each other.
  conditionsConnection: 'and' | 'or'

  // List of conditions. Order matter. First matching condition gets executed.
  conditions: Array<ConditionTypes>
}

// Rule triggered on the question entry.
interface EntryRule<ConditionTypes> extends ConditionalRule<ConditionTypes> {
  type: 'entry'
}

// Rule triggered on the question exit.
interface ExitRule<ConditionTypes> extends ConditionalRule<ConditionTypes> {
  type: 'exit'
}

interface BaseCondition {
  // "IF" part of the condition. For now the only allowed value is "answer"
  when: 'answer'

  // ID of the question this condition depends on.
  to: string
}

// Additional field value for forms.
interface WithField {
  // ID of the field from which the value will be taken.
  field: string
}

// Conditions allowed on picture and multiple choice questions.
type ChoiceConditions = EqualityCondition | BlankCondition

// Conditions allowed on ratings questions.
type RatingConditions = EqualityCondition | BlankCondition | ComparableCondition | RangeCondition

// Conditions allowed on forms questions.
type FormConditions = (EqualityCondition | BlankCondition | ContainmentCondition) & WithField

// Tests a value equality.
interface EqualityCondition extends BaseCondition {
  // What kind of condition this one is.
  is: 'eq' | 'neq'

  // ID of the answer of which value will be used for comparison.
  value: string
}

// Tests the existence (or lack) of an answer.
interface BlankCondition extends BaseCondition {
  is: 'blank' | 'nblank'
}

// Tests comparison between values.
interface ComparableCondition extends BaseCondition {
  is: 'gt' | 'gte' | 'lt' | 'lte'

  // An value used for comparision.
  value: number
}

// Tests if the value is in a range.
interface RangeCondition extends BaseCondition {
  is: 'between',

  // A tuple of inclusive values to compare the question's value to.
  value: [number, number]
}

// Tests if the answer contains a specific string.
interface ContainmentCondition extends BaseCondition {
  is: 'contain' | 'ncontain'

  // The string that must (not to) be included in an anwser.
  value: string
}

// Demo implemnetation for a MultiChoice question.
const schema: QuestionLogic<ChoiceConditions> = {
  _id: "object_id",
  questionId: 'question_id',
  rules: [
    {
      type: "default",
      destination: 'last_page'
    },
    {
      type: "entry",
      destination: "question_4",
      conditionsConnection: "and",
      conditions: [
        {
          // When "answer" to "question_1" is "eq" the value of "response".
          when: "answer",
          to: "question_1",
          is: "eq",
          value: 'response'
        },
        {
          when: "answer",
          to: "question 2",
          is: "blank",
        }
      ],
    },
    {
      type: "exit",
      destination: "end_page",
      conditionsConnection: "or",
      conditions: [
        {
          when: "answer",
          to: "question_3",
          is: "eq",
          value: "another_resposne",
        }
      ],
    }
  ]
}
