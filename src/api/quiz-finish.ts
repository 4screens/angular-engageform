export default interface QuizFinish {
  userIdent: string;
  globalUserIdent: string;
  outcome: string;
  totalScore: number;
  maxScore: number;
  msg: string;
}
