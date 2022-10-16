import Bootstrap from './bootstrap'
import { NullableString } from './types'
import UserIdent from "./api/user-ident.interface";

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

  public initUserId(quizId: string, isLive: boolean) {
    let url = Bootstrap.getConfig('backend').domain + Bootstrap.getConfig('engageform').userIdentInitUrl;
    url = url.replace(':quizId', quizId);

    let localEventUserId = this.getEventUserId(quizId);
    let localUserId = this.id;
    if (isLive) {
      if (!localEventUserId || !localUserId) {
        Bootstrap.$http.get<UserIdent>(url).then((res) => {
          this.setEventUserId(quizId, res.data.eventUserId);
          this.id = res.data.userIdent;
        });
      }
    } else {
      if (!localUserId) {
        Bootstrap.$http.get<UserIdent>(url).then((res) => {
          this.id = res.data.userIdent;
        });
      }
    }
  }

  private constructor() {}
}

User.$inject = ['$http']
