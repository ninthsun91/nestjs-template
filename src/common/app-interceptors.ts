import { Provider } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { APILogInterceptor } from './interceptors'

export const AppInterceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: APILogInterceptor,
  },
]
