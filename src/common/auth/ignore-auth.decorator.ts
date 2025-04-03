import { SetMetadata } from '@nestjs/common'

export const IgnoreAuthKey = 'ignoreAuthentication'
export const IgnoreAuth = () => SetMetadata(IgnoreAuthKey, true)
