export type Nullable<T> = T | null
export type NullableString = Nullable<string>

export type Maybe<T> = T | undefined
export type MaybeString = Maybe<string>
export type MaybeNumber = Maybe<number>
export type MaybeBoolean = Maybe<boolean>

export type Id = string
export type WithId = {_id: Id}
