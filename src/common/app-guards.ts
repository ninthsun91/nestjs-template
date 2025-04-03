import { Provider } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth'

export const AppGuards: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
]
