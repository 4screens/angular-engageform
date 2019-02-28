/**
 * Demo implementation for a MultiChoice question.
 *
 * @example
 * const schema: QuestionLogic = {
 *   _id: "object_id",
 *   questionId: 'question_id',
 *   rules: [
 *     {
 *       type: "default",
 *       destination: 'last_page'
 *     },
 *     {
 *       type: "entry",
 *       destination: "question_4",
 *       conditionsConnection: "and",
 *       conditions: [
 *         {
 *           // When "answer" to "question_1" is "eq" the value of "response".
 *           when: "answer",
 *           to: "question_1",
 *           is: "eq",
 *           value: 'response'
 *         },
 *         {
 *           when: "answer",
 *           to: "question 2",
 *           is: "blank",
 *         }
 *       ],
 *     },
 *     {
 *       type: "exit",
 *       destination: "end_page",
 *       conditionsConnection: "or",
 *       conditions: [
 *         {
 *           when: "answer",
 *           to: "question_3",
 *           is: "eq",
 *           value: "another_resposne",
 *         }
 *       ],
 *     }
 *   ]
 * }
 */

export interface QuestionLogic {
  // Object's ID.
  _id: string

  // ID of the question this logic object belongs to.
  questionId: string

  // List of all rules managing to this condition object.
  rules: Array<DefaultRule | EntryRule | ExitRule>
}

export enum RuleType {
  Default = 'default',
  Entry = 'entry',
  Exit = 'exit',
}

export enum ConditionConnection {
  And = 'and',
  Or = 'or',
}

export enum ConditionIs {
  Equal = 'eq',
  NotEqual = 'neq',
  Blank = 'blank',
  NotBlank = 'nblank',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  Between = 'between',
  Contain = 'contain',
  NotContain = 'ncontain',
}
interface BaseRule {
  // ID of the question the rule will forward to.
  destination: string
}

// "Otherwise" rule executed when no other rule matches.
export interface DefaultRule extends BaseRule {
  type: RuleType.Default
}

// Rule triggered on the question entry.
export interface EntryRule extends BaseRule, ConditionalRule {
  type: RuleType.Entry
}

// Rule triggered on the question exit.
export interface ExitRule extends BaseRule, ConditionalRule {
  type: RuleType.Exit
}

interface ConditionalRule {
  // How conditions are connected with each other.
  conditionsConnection: ConditionConnection.And | ConditionConnection.Or

  // List of conditions. Order matter. First matching condition gets executed.
  conditions: Array<CommonConditions | RatingConditions | FormConditions>
}

// Conditions allowed on picture and multiple choice questions.
type CommonConditions = EqualityCondition | BlankCondition

// Conditions allowed on ratings questions.
type RatingConditions = CommonConditions | ComparableCondition | RangeCondition

// Conditions allowed on forms questions.
export type FormConditions = (CommonConditions | ContainmentCondition) & WithField

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

// Tests a value equality.
interface EqualityCondition extends BaseCondition {
  // What kind of condition this one is.
  is: ConditionIs.Equal | ConditionIs.NotEqual

  // ID of the answer of which value will be used for comparison.
  value: string
}

// Tests the existence (or lack) of an answer.
interface BlankCondition extends BaseCondition {
  is: ConditionIs.Blank | ConditionIs.NotBlank
}

// Tests comparison between values.
interface ComparableCondition extends BaseCondition {
  is: ConditionIs.GreaterThan | ConditionIs.GreaterThanOrEqual | ConditionIs.LessThan | ConditionIs.LessThanOrEqual

  // An value used for comparision.
  value: number
}

// Tests if the value is in a range.
interface RangeCondition extends BaseCondition {
  is: ConditionIs.Between,

  // A tuple of inclusive values to compare the question's value to.
  value: [number, number]
}

// Tests if the answer contains a specific string.
interface ContainmentCondition extends BaseCondition {
  is: ConditionIs.Contain | ConditionIs.NotContain

  // The string that must (not to) be included in an answer.
  value: string
}
