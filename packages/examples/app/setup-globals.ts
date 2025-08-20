// Setup global polyfills for browser compatibility
import { Buffer } from 'buffer'

// Make Buffer available globally
;(globalThis as any).Buffer = Buffer

// Make global available as well
;(globalThis as any).global = globalThis