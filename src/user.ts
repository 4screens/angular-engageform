import Bootstrap from './bootstrap'
import { NullableString } from './types'

export default class User {
  static create() {
    return new User()
  }

  private static idKey = 'userIdent'
  private static sessionIdKey = 'sessionIdent'

  private _id: NullableString = null
  private _sessionId: NullableString = null
  private _eventUserIds: { [key: string]: NullableString } = {}

  get id(): NullableString {
    if (!this._id) {
      this._id = Bootstrap.localStorage.get<NullableString>(User.idKey)
    }
    return this._id
  }

  set id(id: NullableString) {
    Bootstrap.localStorage.set(User.idKey, id)
    this._id = id
  }

  get sessionId(): NullableString {
    if (!this._sessionId) {
      this._sessionId = Bootstrap.localStorage.get<NullableString>(User.sessionIdKey)
    }
    return this._sessionId
  }

  set sessionId(sessionId: NullableString) {
    Bootstrap.localStorage.set(User.sessionIdKey, sessionId)
    this._sessionId = sessionId
  }

  public getEventUserId(quizId: string): NullableString {
    let localEventUserId = this._eventUserIds[quizId]
    if (!localEventUserId) {
      let eventUserIdKey = 'eventUserIdent_'+quizId
      localEventUserId = Bootstrap.localStorage.get<NullableString>(eventUserIdKey)
    }
    return localEventUserId
  }

  public setEventUserId(quizId: string, eventUserId: string) {
    let eventUserIdKey = 'eventUserIdent_'+quizId
    Bootstrap.localStorage.set(eventUserIdKey, eventUserId)
    this._eventUserIds[quizId] = eventUserId
  }

  private constructor() {}
}
