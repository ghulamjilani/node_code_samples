import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * AuthMiddleware is responsible for authenticating HTTP requests and denying
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when authentication fails
   */
  private redirectTo: string = '/login'

  /**
   * Handles the authentication of requests.
   * 
   * @param ctx - The HTTP context containing the request and response
   * @param next - The next function to call in the middleware stack
   * @param options - Optional authentication guards to use
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ): Promise<void> {
    // Authenticate the user using the specified guards
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

    // Call the next middleware in the stack
    await next()
  }
}
