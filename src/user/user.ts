import Bootstrap from '../bootstrap'

export default class User implements UserProperties {
  private _id: string
  private _sessionId: string

  get id(): string {
    if (!this._id) {
      this._id = <string>Bootstrap.localStorage.get('userIdent')
    }
    return this._id
  }

  set id(id: string) {
    Bootstrap.localStorage.set('userIdent', id)
    this._id = id
  }

  get sessionId(): string {
    if (!this._sessionId) {
      this._sessionId = <string>Bootstrap.localStorage.get('sessionIdent')
    }
    return this._sessionId
  }

  set sessionId(sessionId: string) {
    Bootstrap.localStorage.set('sessionIdent', sessionId)
    this._sessionId = sessionId
  }
}
