import { setupWorker } from 'msw/browser'

import CityMockApi from './demo/_city'
import TableMockApi from './demo/_tables'

export const handlers = [...CityMockApi, ...TableMockApi]
export const worker = setupWorker(...handlers)
