import Bootstrap from './bootstrap'
import { NullableString } from './types'

export default class User {
  static create() {
    return new User()
  }

  private static idKey = 'userIdent'
  private static sessionIdKey = 'sessionIdent'
  private static eventUserIdKey = 'eventUserIdent'

  private _id: NullableString = null
  private _sessionId: NullableString = null

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

  get eventUserId(): NullableString {
    if (!this._sessionId) {
      this._sessionId = Bootstrap.localStorage.get<NullableString>(User.eventUserIdKey)
    }
    return this._sessionId
  }

  set eventUserId(sessionId: NullableString) {
    Bootstrap.localStorage.set(User.eventUserIdKey, sessionId)
    this._sessionId = sessionId
  }

  private constructor() {}
}
