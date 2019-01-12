import angular from 'angular'
import Engageform from './engageform'

export default interface EngageformInstances {
  [index: string]: angular.IPromise<Engageform>
}
