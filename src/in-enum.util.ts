import {values, includes} from 'lodash'

export default function isInEnum<T>(enumeration: T, value: string) {
  return includes(values(enumeration), value)
}
