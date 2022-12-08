import Bootstrap from './bootstrap'
import { NullableString } from './types'
import UserIdent from "./api/user-ident.interface";
import angular from "angular";
import PageSentProperties from "./page/page-sent.interface";

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

  public getUserId(quizId: string, isLive: boolean): angular.IPromise<void> | void {
    let url = Bootstrap.getConfig('backend').domain + Bootstrap.getConfig('engageform').userIdentInitUrl;
    url = url.replace(':quizId', quizId);

    const localEventUserId = this.getEventUserId(quizId);
    const localUserId = this.sessionId;
    if (isLive) {
      if (!localEventUserId || !localUserId) {
        return Bootstrap.$http.post<UserIdent>(url, {}).then((res) => {
          if (!localEventUserId) {
            this.setEventUserId(quizId, res.data.eventUserId);
          }
          if (!localUserId) {
            this.sessionId = res.data.userIdent;
          }
        });
      }
    } else {
      if (!localUserId) {
        return Bootstrap.$http.post<UserIdent>(url, {}).then((res) => {
          this.sessionId = res.data.userIdent;
        });
      }
    }
  }

  public initUserId(quizId: string, isLive: boolean): angular.IPromise<void> {
    const deferred = Bootstrap.$q.defer<void>()
    deferred.resolve(this.getUserId(quizId, isLive))
    return deferred.promise;
  }

  private constructor() {}
}

User.$inject = ['$http']
