import { from } from 'env-var'

export type ApplicationConfig = {
  HTTP_HOST: string
  HTTP_PORT: number
  USE_WORKERS: boolean
  USE_CLUSTER: boolean
}

export default function getConfig (env: NodeJS.ProcessEnv): ApplicationConfig {
  const { get } = from(env)

  return {
    HTTP_HOST: get('HTTP_HOST').default('0.0.0.0').asString(),
    HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
    USE_WORKERS: get('USE_WORKERS').default('false').asBool(),
    USE_CLUSTER: get('USE_CLUSTER').default('false').asBool()
  }
}